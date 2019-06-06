import {getMap, getLayerGroupCollection} from '../map/map'

let containerId = 'rsdu-left-menu'

export class Menu{

    constructor(options){
        this.layerCollection = options.layerCollection || []
        this.groupCollection = options.groupCollection || {}
    }

    getLayersMap(){

        let map = {}

        for(let [key, layerModel] of this.layerCollection){
            if(!map[layerModel.subgroupId]) map[layerModel.subgroupId] = []
            map[layerModel.subgroupId].push(layerModel)
        }

        return map
    }

    render(){

        let html = ''
        let layersMap = this.getLayersMap()

        for(let [prop, group] of this.groupCollection) {

            html += `<li class="nav-title">${group.name}</li>`

            group.subgroups.forEach((subgroup) => {

                let subGrouplayers = ''

                if(layersMap[subgroup.id]){

                    layersMap[subgroup.id].forEach((layer) => {
                        subGrouplayers += `
                            <li class="nav-item">
                                <a class="nav-link rsdu-layer-group" href="#">
                                    <div class="rsdu-clip" >${layer.name}</div>
                                    <label class="switch switch-pill switch-outline-dark-alt switch-sm float-right rsdu-label-align-center">
                                        <input class="switch-input rsdu-layer-switch" type="checkbox" checked="" data-rsdu-layer-id="${layer.id}">
                                        <span class="switch-slider"></span>
                                    </label>
                                </a>
                            </li>
                        `
                    })
                }

                html += `
                    <li class="nav-item nav-dropdown">
                        <a class="nav-link nav-dropdown-toggle" href="#">
                            <i class="nav-icon icon-puzzle"></i> ${subgroup.name}</a>
                            <ul class="nav-dropdown-items">
                                ${subGrouplayers}
                            </ul>
                    </li>
                `
            })
        }

        $(`#${containerId}`).append(html);

        $('a.rsdu-layer-group').on('dblclick', function(){

            let layerId = parseInt($(this).find('.rsdu-layer-switch').attr('data-rsdu-layer-id'))

            if(isNaN(layerId)) return

            let map = getMap(),
                group = getLayerGroupCollection().get(layerId)

            if(!group) return

            map.flyToBounds(group.getBounds())
        })

        $('input.rsdu-layer-switch').on('change', function(){

            let enabled = $(this).is(':checked'),
                layerId = parseInt($(this).attr('data-rsdu-layer-id')),
                map = getMap(),
                layerGroupCollection = getLayerGroupCollection()

            if(!layerGroupCollection.get(layerId)) return

            enabled ? map.addLayer(layerGroupCollection.get(layerId)) : map.removeLayer(layerGroupCollection.get(layerId))
        })
    }
}
