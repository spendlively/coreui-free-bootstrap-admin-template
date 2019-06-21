import dateformat from 'dateformat'
import {carsDescriptionListUrn, carsListUrn} from '../ajax/urn'
import {ajax} from "../ajax/ajax"
import config from "../config/config"
import CarModel from "../model/CarModel"
import {getCarsLayerGroup, getGuidToLayerMap, getMap} from "../map/map"
import L from "leaflet"
import CarDescriptionModel from "../model/CarDescriptionModel"
import {
    RSDU_LAYER_CARD_CAR_ID,
    RSDU_LAYER_CARD_NAME,
    RSDU_LAYER_CARD_DESC,
    RSDU_LAYER_CARD_PHONE,
    RSDU_LAYER_CARD_TIME,
    RSDU_LAYER_CARD_VLCT,
    RSDU_LAYER_CARD_VLCT_UNIT,
    RSDU_LAYER_CARD_CRC
} from '../l10n/l10n'

export const LAYER_ALIAS = 'CARS'
export const CARS_ID = 'cars'

let carDescriptionMap = new Map(),
    carMap = new Map(),
    iconDivCls = 'rsdu-car-icon'

export function getCarDescriptionMap(){
    return carDescriptionMap
}

export function getCarMap(){
    return carMap
}

export function init() {

    ajax(`${config.serverUrl}${carsDescriptionListUrn}`)
        .then(json => {
            json.forEach((data) => {
                carDescriptionMap.set(data.guid, new CarDescriptionModel(data))
            })

            ajax(`${config.serverUrl}${carsListUrn}`)
                .then(json => {
                    json.forEach((data) => {

                        let carDescriptionModel = carDescriptionMap.get(data.guid)

                        if(!carDescriptionModel) return

                        data.descriptionModel = carDescriptionModel
                        let carModel = new CarModel(data)

                        setCar(carModel)
                    })
                })
        })

}

export function setCar(cm){

    let carModel = carMap.get(cm.guid),
        carsLayerGroup = getCarsLayerGroup()

    // //С320ОН53
    // if(carModel && carModel.guid === '1433a0e6-8120-11e9-a5eb-0050568518fc') debugger

    if(carModel){
        carModel.exchange(cm)
    } else {
        carModel = cm
    }

    if(carModel.leafletLayer){
        moveCarTo(carModel)
    } else {

        let icon = L.divIcon({
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor:  [0, -28],
            className: iconDivCls,
            html: `<img class="${getIconClassByCrc(carModel.crc)}" src="${carModel.descriptionModel.icon}">`,
        });

        // let icon = L.icon({
        //     iconSize: [36, 36],
        //     iconAnchor: [18, 36],
        //     popupAnchor:  [0, -28],
        //     iconUrl: carModel.descriptionModel.icon
        // });

        carModel.leafletLayer = L.marker([carModel.lat, carModel.lng], {icon: icon}).addTo(carsLayerGroup)
    }

    carModel.leafletLayer.bindPopup(getPopupContent(carModel), {maxWidth: config.popupMaxWidth})

    carMap.set(carModel.guid, carModel)

    if ($(`#${getMessageIdByGuid(carModel.guid)}`).length !== 0) {
        updateMessage(carModel)
    } else {
        addMessage(carModel)
    }
}

function getIconClassByCrc(crc){
    if(crc > 180 && crc < 360) return 'left-turn'
    return 'right-turn'
}

/**
 * Плавное перемещение машины
 * @param carModel
 */
function moveCarTo(carModel){

    let fx = new L.PosAnimation(),
        map = getMap(),
        point = map.latLngToLayerPoint(L.latLng(carModel.lat, carModel.lng))

    fx.on('end', () => {
        $(carModel.leafletLayer._icon).children('img').attr("class", getIconClassByCrc(carModel.crc))
        carModel.leafletLayer.setLatLng([carModel.lat, carModel.lng])
    })

    fx.run(carModel.leafletLayer._icon, point, 1);
}

function getPopupContent(carModel) {

    let dateStr = '',
        now = new Date()

    if(dateformat(now, 'ddmmyyyy') === dateformat(carModel.date, 'ddmmyyyy')){
        let diff = new Date(+now.getTime() - carModel.date.getTime() + (now.getTimezoneOffset() * 60 * 1000))

        if(dateformat(now, 'HH:MM') === dateformat(carModel.date, 'HH:MM')){
            dateStr = `${dateformat(carModel.date, 'HH:MM:ss')} (${dateformat(diff, 'ss сек. назад')})`
        } else {
            dateStr = `${dateformat(carModel.date, 'HH:MM:ss')} (${dateformat(diff, 'HH ч. MM мин. назад')})`
        }
    } else {
        dateStr = dateformat(carModel.date, 'dd.mm.yyyy HH:MM:ss')
    }

    let popupHtml = `
            <table border="0">
                <tr><td align="right"><strong>${RSDU_LAYER_CARD_CAR_ID}:&nbsp;</strong></td><td class="text-nowrap">${carModel.descriptionModel.carId}</td></tr>
                <tr><td align="right"><strong>guid:&nbsp;</strong></td><td class="text-nowrap">${carModel.guid}</td></tr>
                <tr><td align="right"><strong>${RSDU_LAYER_CARD_NAME}:&nbsp;</strong></td><td class="text-nowrap">${carModel.descriptionModel.name}</td></tr>
                <tr><td align="right"><strong>${RSDU_LAYER_CARD_PHONE}:&nbsp;</strong></td><td class="text-nowrap">${carModel.descriptionModel.phone}</td></tr>
                <tr><td align="right"><strong>${RSDU_LAYER_CARD_DESC}:&nbsp;</strong></td><td class="text-nowrap">${carModel.descriptionModel.typeName}</td></tr>
                <tr><td align="right"><strong>${RSDU_LAYER_CARD_TIME}:&nbsp;</strong></td><td class="text-nowrap">${dateStr}</td></tr>
                <tr><td align="right"><strong>${RSDU_LAYER_CARD_CRC}:&nbsp;</strong></td><td class="text-nowrap">${carModel.crcs}</td></tr>
                <tr><td align="right"><strong>${RSDU_LAYER_CARD_VLCT}:&nbsp;</strong></td><td class="text-nowrap">${carModel.vlct} ${RSDU_LAYER_CARD_VLCT_UNIT}</td></tr>
            </table>`

    return popupHtml
}

export function removeCarByGuid(guid){

    let carModel = carMap.get(guid),
        carsLayerGroup = getCarsLayerGroup()

    if(!carModel) return

    carsLayerGroup.removeLayer(carModel.leafletLayer)
    removeMessageByGuid(guid)
    carMap.delete(guid)
    carModel = null
}

export function selectCarByGuid(guid) {

    let map = getMap(),
        carModel = carMap.get(guid)

    if(!carModel || !carModel.leafletLayer){
        return
    }

    //Если у слоя есть getBounds (линии), выставляем карту по ним
    if (typeof carModel.leafletLayer.getBounds !== 'undefined') {
        map.flyToBounds(carModel.leafletLayer.getBounds())
    }
    //Если у слоя есть getLatLng (точки), выставляем карту по координатам
    else if (typeof carModel.leafletLayer.getLatLng !== 'undefined') {
        map.panTo(carModel.leafletLayer.getLatLng())
    }

    //Пока что popup открывается по событию click
    carModel.leafletLayer.fire('click')
}

function getMessageIdByGuid(guid){
    return `car-message-${guid}`
}

function getMessageBodyCls(carModel){

    let borderLeftCls = 'rsdu-car-disabled'

    //Зеленая и красная полосы показываются, если последнему сообщению менее 24 часов
    if((+new Date() - carModel.date) < (1000*60*60*24)){
        if(carModel.vlct > 0){
            borderLeftCls = 'rsdu-car-runing'
        } else if(carModel.vlct === 0){
            borderLeftCls = 'rsdu-car-stopped'
        }
    }

    return `p-3 message car-message ${borderLeftCls}`
}

function addMessage(carModel){

    let messageId = getMessageIdByGuid(carModel.guid),
        time = ''

    //Время показывается только у сегодняшних сообщений
    if(dateformat(new Date(), 'ddmmyyyy') === dateformat(carModel.date, 'ddmmyyyy')){
        time = `<small class="text-muted float-right mt-1 rsdu-car-time"><i class="icon-calendar"></i>&nbsp; ${dateformat(carModel.date, 'HH:MM:ss')}</small>`
    } else {
        time = `<small class="text-muted float-right mt-1 rsdu-car-time"></small>`
    }

    let message = `
        <div id="${messageId}" class="${getMessageBodyCls(carModel)}">
            <div class="mr-3 float-left">
                <div><img src="${carModel.descriptionModel.icon}" class="rsdu-cursor-pointer" onclick="rsduShowLayerByGuid('${carModel.guid}', '${LAYER_ALIAS}')"></div>
            </div>
            <div>
                <small class="text-muted">${carModel.descriptionModel.typeName}</small>
                ${time}
            </div>
            <div class="text-truncate font-weight-bold">${carModel.descriptionModel.carId}</div>
            <small class="text-muted">${carModel.descriptionModel.name}</small><br>
            <small class="text-muted"><strong>${RSDU_LAYER_CARD_PHONE}: </strong>${carModel.descriptionModel.phone}</small><br>
            <small class="text-muted rsdu-car-crcs"><strong>${RSDU_LAYER_CARD_CRC}: </strong>${carModel.crcs}</small><br>
            <small class="text-muted rsdu-car-vlct"><strong>${RSDU_LAYER_CARD_VLCT}: </strong>${carModel.vlct} ${RSDU_LAYER_CARD_VLCT_UNIT}</small>
        </div>`

    $(`#${CARS_ID}`).append($(message))
}

function updateMessage(carModel){

    let jMessage = $(`#${getMessageIdByGuid(carModel.guid)}`),
        time = ''

    //Время показывается только у сегодняшних сообщений
    if(dateformat(new Date(), 'ddmmyyyy') === dateformat(carModel.date, 'ddmmyyyy')){
        time = `<i class="icon-calendar"></i>&nbsp; ${dateformat(carModel.date, 'HH:MM:ss')}`
    }

    // //В314НЕ53
    // if(carModel.guid === '13ce9f31-8120-11e9-a5eb-0050568518fc'){
    //     console.log(dateformat(carModel.date, 'HH:MM:ss'))
    //     debugger
    // }

    jMessage.attr("class", getMessageBodyCls(carModel))
    jMessage.find(".rsdu-car-time").html(time)
    jMessage.find(".rsdu-car-crcs").html(`<strong>${RSDU_LAYER_CARD_CRC}: </strong>${carModel.crcs}`)
    jMessage.find(".rsdu-car-vlct").html(`<strong>${RSDU_LAYER_CARD_VLCT}: </strong>${carModel.vlct} ${RSDU_LAYER_CARD_VLCT_UNIT}`)
}

function removeMessageByGuid(guid){

    let messageId = getMessageIdByGuid(guid)
    $(`#${messageId}`).remove()
}
