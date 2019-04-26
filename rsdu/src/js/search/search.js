import {ajax} from "../ajax/ajax";
import {searchUrn} from "../ajax/urn";
import config from "../config/config";
import {getMap, getGuidToLayerMap, getLayers} from "../map/map";

let layers = {},
    maxCount = 14,
    lastSearch = ''

export function init() {

    $('#rsdu-search').keyup(function(event){

        let searchStr = $(this).val()

        if(!searchStr) return;

        //Чтобы не отправлять повторно один запрос
        //и выпадающее меню не "моргало" при нажатии на стрелочки
        if(searchStr === lastSearch) return;

        search(searchStr)
        lastSearch = searchStr
    })
}

function search(searchStr){

    let list = $('#rsdu-search-dropdown-menu').html(''),
        layersList = $('input.rsdu-layer-switch').map((index, value) => {
            return $(value).is(':checked') ? $(value).attr('data-rsdu-layer-id') : null
        }).toArray().join(',')

    ajax(`${config.serverUrl}${searchUrn}?q=${searchStr}&layers=${layersList}`)
        .then(function (json) {

            layers = {}
            for(let i = 0; i < json.items.length && i < maxCount; i++){

                let item = json.items[i],
                    ind = i + 1

                layers[ind] = item;

                let listEl = $(`<a class="dropdown-item rsdu-search-layers-list-item" href="#" data-rsdu-layer-id="${ind}">${item.name}</a>`)
                listEl.click(() => {
                    selectLayer(listEl)
                })

                list.append(listEl)
            }

            //Открыть dropdown
            if(!$('#rsdu-search-dropdown-menu').hasClass('show')) list.dropdown('toggle')
        })
}

function selectLayer(listEl){

    let index = listEl.attr('data-rsdu-layer-id'),
        layerData = layers[index],
        map = getMap(),
        guidToLayerMap = getGuidToLayerMap(),
        layer = guidToLayerMap[layerData.guid]

    if(!layer) return

    //Если у слоя есть getBounds (линии), выставляем карту по ним
    if(typeof layer.getBounds !== "undefined"){
        map.flyToBounds(layer.getBounds())
    }
    //Если у слоя есть getLatLng (точки), выставляем карту по координатам
    else if(typeof layer.getLatLng !== "undefined"){
        map.panTo(layer.getLatLng())
    }
    layer.openPopup()
}
