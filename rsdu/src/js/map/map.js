import L from "leaflet"
// import "leaflet.fullscreen/Control.FullScreen.css"
import "leaflet.fullscreen/Control.FullScreen"
import config from "../config/config"
import {ajax} from "../ajax/ajax"
import {mapConfigUrn, providerUrn, layerListUrn, layerGroupUrn, stateUrn} from "../ajax/urn"
import MapConfig from "../entity/map"
import Provider from "../entity/provider"
import Layer from "../entity/layer"
import Group from "../entity/group"
import State from "../entity/state"
import {Menu as LayerMenu} from "../menu/layers"

let containerId = 'rsdu-map-container',
    map,
    mapConfig,
    providers = {},
    layers = [],
    groups = [],
    layerGroups = {},
    states = {},
    guidToLayerMap = {}

function fetchConfig() {

    return ajax(`${config.serverUrl}${mapConfigUrn}`)
        .then(json => {
            let configs = json.items.filter(item => item.selected === 1)

            if (configs.length > 1) throw new Error('Выбрано больше одной конфигурации для ГИС')
            else if (configs.length < 1) throw new Error('Не выбрано ни одной конфигурации для ГИС')

            mapConfig = new MapConfig(configs[0])

            return mapConfig
        })
}

function fetchProviders() {

    return ajax(`${config.serverUrl}${providerUrn}`)
        .then(json => {

            json.items.forEach(item => {
                let provider = new Provider(item)
                providers[provider.id] = provider;
            })

            return providers
        })
}

function fetchLayers() {

    return ajax(`${config.serverUrl}${layerListUrn}`)
        .then(json => {

            json.items.forEach(item => {
                layers.push(new Layer(item))
            })

            return layers
        })
}

function fetchLayerGroups() {

    return ajax(`${config.serverUrl}${layerGroupUrn}`)
        .then(json => {

            json.items.forEach(item => {
                groups.push(new Group(item))
            })

            return groups
        })
}

function fetchStates() {

    return ajax(`${config.serverUrl}${stateUrn}`)
        .then(json => {

            json.items.forEach(item => {
                let state = new State(item)
                states[state.id] = state
            })

            return {}
        })
}

export function getMap() {
    return map
}

export function getLayerGroups() {
    return layerGroups
}

export function getLayers() {
    return layers
}

export function getGuidToLayerMap() {
    return guidToLayerMap
}

export function init() {

    Promise.all([
        fetchConfig(),
        fetchProviders(),
        fetchLayers(),
        fetchLayerGroups(),
        fetchStates()
    ]).then(args => {
        renderMap()
    })
}

function renderMap() {

    let baseLayers = {},
        providersCount = 0

    for (let ind in providers) {
        if (!providers.hasOwnProperty(ind)) continue
        let provider = providers[ind]
        baseLayers[provider.title] = L.tileLayer(provider.url, {id: provider.name})
        providersCount++
    }

    map = L.map(containerId, {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        },
        preferCanvas: true,
        center: mapConfig.coordinates,
        zoom: mapConfig.scale,
        layers: [baseLayers[providers[mapConfig.providerId].title]]
    })

    if(providersCount > 1) L.control.layers(baseLayers).addTo(map)

    layers.forEach(layer => {

        layerGroups[layer.id] = L.layerGroup();

        L.geoJSON(layer.kml, {
            pointToLayer: function (feature, latlng) {
                let circleMarker = L.circleMarker(latlng, {
                    color: 'black',
                    fillColor: 'white',
                    fillOpacity: 1,
                    radius: 5,
                    weight: 1
                })

                return circleMarker
            },
            onEachFeature: function (feature, layer) {

                guidToLayerMap[feature.properties.guid] = layer
                bindSelectingLayer(feature, layer)
                bindPopup(feature, layer)
            }
        }).addTo(layerGroups[layer.id])

        layerGroups[layer.id].addTo(map)
    })

    let layerMenu = new LayerMenu({
        layers: layers,
        groups: groups
    });

    layerMenu.render();
}

function bindPopup(feature, layer){

    let popupHtml = ""

    //Ставлю name на первое место
    if(feature.properties['name']) popupHtml += `<tr><td><strong>name:&nbsp;</strong></td><td class="text-nowrap">${feature.properties['name']}</td></tr>`

    for(let prop in feature.properties){
        if(!feature.properties.hasOwnProperty(prop)) continue
        if(prop === 'styleUrl' || prop === 'name') continue

        popupHtml += `<tr><td><strong>${prop}:&nbsp;</strong></td><td class="text-nowrap">${feature.properties[prop]}</td></tr>`
    }

    if(popupHtml){
        layer.bindPopup(`<table border="0">${popupHtml}</table>`)
    }
}

function bindSelectingLayer(feature, layer){

    layer.on('popupopen', ()=>{
        activateLayer(feature, layer)
    })

    layer.on('popupclose', ()=>{
        deactivateLayer(feature, layer)
    })
}

function activateLayer(feature, layer){
    // console.log(layer.defaultOptions.color, layer.options.color)
    layer.setStyle({color: 'red'})
    layer.bringToFront()
}

function deactivateLayer(feature, layer){
    // console.log(layer.defaultOptions.color, layer.options.color)
    layer.setStyle({color: layer.defaultOptions.color})
}
