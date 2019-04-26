import {getMap, getLayerGroups} from '../map/map'

let containerId = 'rsdu-left-menu'

export class Menu{

    constructor(options){
        this.layers = options.layers || []
        this.groups = options.groups || []
    }

    getLayersMap(){

        let map = {}

        this.layers.forEach((layer) => {
            if(!map[layer.subgroupId]) map[layer.subgroupId] = []
            map[layer.subgroupId].push(layer)
        })

        return map
    }

    render(){

        let html = ''
        let layersMap = this.getLayersMap()

        this.groups.forEach((group) => {
            html += `<li class="nav-title">${group.name}</li>`

            group.subgroups.forEach((subgroup) => {

                let subGrouplayers = ''

                if(layersMap[subgroup.id]){

                    layersMap[subgroup.id].forEach((layer) => {
                        subGrouplayers += `
                            <li class="nav-item">
                                <a class="nav-link" href="#">
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
        })

        $(`#${containerId}`).append(html);

        $('input.rsdu-layer-switch').on('change', function(){

            let enabled = $(this).is(':checked'),
                layerId = parseInt($(this).attr('data-rsdu-layer-id')),
                map = getMap(),
                layerGroups = getLayerGroups()

            if(!layerGroups[layerId]) return

            enabled ? map.addLayer(layerGroups[layerId]) : map.removeLayer(layerGroups[layerId])
        })
    }
}
