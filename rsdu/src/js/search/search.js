import {ajax} from '../ajax/ajax'
import {searchUrn} from '../ajax/urn'
import config from '../config/config'
import {getMap, getGuidToLayerMap} from '../map/map'
import {LAYER_ALIAS as CARS_LAYER_ALIAS, selectCarByGuid} from "../car/car";

let layers = {},
    maxCount = 20,
    lastSearch = ''

export function init() {

    window.rsduShowLayerByGuid = rsduShowLayerByGuid

    $('#rsdu-search')
        .keyup(function (event) {

            let searchStr = $(this)
                .val()

            if (!searchStr) {
                return
            }

            //Чтобы не отправлять повторно один запрос
            //и выпадающее меню не "моргало" при нажатии на стрелочки
            if (searchStr === lastSearch) {
                return
            }

            search(searchStr)
            lastSearch = searchStr
        })
}

function search(searchStr) {

    let jList = $('#rsdu-search-dropdown-menu')
            .html(''),
        jLayersList = $('input.rsdu-layer-switch')
            .map((index, value) => {
                return $(value)
                    .is(':checked') ? $(value)
                    .attr('data-rsdu-layer-id') : null
            })
            .toArray()
            .join(',')

    ajax(`${config.serverUrl}${searchUrn}`, {
        method: 'POST',
        body: JSON.stringify({
            'q': searchStr,
            'layers': jLayersList
        })
    })
        .then(function (json) {

            layers = {}
            for (let i = 0; i < json.items.length && i < maxCount; i++) {

                let item = json.items[i],
                    ind = i + 1

                layers[ind] = item

                let jListEl = $(`<a class="dropdown-item" href="#" onclick="rsduShowLayerByGuid('${item.guid}', '${item.layer_alias}')">${item.name}</a>`)
                jList.append(jListEl)
            }

            //Открыть dropdown
            if (!$('#rsdu-search-dropdown-menu')
                .hasClass('show')) {
                jList.dropdown('toggle')
            }
        })
}

export function rsduShowLayerByGuid(id, category) {

    window.event.preventDefault()
    window.event.stopPropagation()

    switch(category){
        case CARS_LAYER_ALIAS:
            selectCarByGuid(id)
            break
        default:
            selectLayerByGuid(id)
    }
}

export function selectLayerByGuid(guid) {

    let map = getMap(),
        guidToLayerMap = getGuidToLayerMap(),
        layer = guidToLayerMap.get(guid)

    if (!layer) {
        return
    }

    //Если у слоя есть getBounds (линии), выставляем карту по ним
    if (typeof layer.getBounds !== 'undefined') {
        map.flyToBounds(layer.getBounds())
    }
    //Если у слоя есть getLatLng (точки), выставляем карту по координатам
    else if (typeof layer.getLatLng !== 'undefined') {
        map.panTo(layer.getLatLng())
    }

    //Пока что popup открывается по событию click
    layer.fire('click')
    // layer.openPopup()
}
