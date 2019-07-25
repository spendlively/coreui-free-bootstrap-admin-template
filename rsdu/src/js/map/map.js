import L from "leaflet"
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min'
import 'leaflet.locatecontrol'
import "leaflet.fullscreen/Control.FullScreen"
import "./leaflet-ruler"
import config from "../config/config"
import {ajax} from "../ajax/ajax"
import {mapModelUrn, providerUrn, layerListUrn, layerGroupUrn, stateUrn, layerStatesUrn} from "../ajax/urn"
import MapModel from "../model/MapModel"
import ProviderModel from "../model/ProviderModel"
import LayerModel from "../model/LayerModel"
import GroupModel from "../model/GroupModel"
import StateModel from "../model/StateModel"
import {Menu as LayerMenu} from "../menu/layers"
import {getCard} from "./card"
import {RSDU_LAYER_CARD_STATE, RSDU_LATITUDE, RSDU_LONGITUDE} from '../l10n/l10n'
import {init as notification} from "../notification/notification"
import {init as initMarkers} from "../marker/marker"
import {init as initSocketio} from "../websocket/socketio"
import {init as initCars, LAYER_ALIAS as CARS_LAYER_ALIAS} from "../car/car"
import {initialPositionControl} from "./control"

let containerId = 'rsdu-map-container',
    map,
    mapModel,
    providerCollection = new Map(),
    layerCollection = new Map(),
    groupCollection = new Map(),
    layerGroupCollection = new Map(),
    stateCollection = new Map(),
    guidToLayerMap = new Map(),
    undefinedColor = '#808080',
    carsLayerGroup = null,
    markersLayerGroup = null,
    pillarRadius = 2

export function getCarsLayerGroup() {
    return carsLayerGroup
}

export function getMarkersLayerGroup() {
    return markersLayerGroup
}

function fetchConfig() {

    return ajax(`${config.serverUrl}${mapModelUrn}`)
        .then(json => {
            let configs = json.items.filter(item => item.selected === 1)

            if (configs.length > 1) throw new Error('Выбрано больше одной конфигурации для ГИС')
            else if (configs.length < 1) throw new Error('Не выбрано ни одной конфигурации для ГИС')

            mapModel = new MapModel(configs[0])

            return mapModel
        })
}

function fetchProviders() {

    return ajax(`${config.serverUrl}${providerUrn}`)
        .then(json => {

            json.items.forEach(item => {
                let providerModel = new ProviderModel(item)
                providerCollection.set(providerModel.id, providerModel);
            })

            return providerCollection
        })
}

function fetchLayers() {

    return ajax(`${config.serverUrl}${layerListUrn}`)
        .then(json => {

            json.items.forEach(item => {
                layerCollection.set(item.id, new LayerModel(item))
            })

            return layerCollection
        })
}

function fetchLayerGroups() {

    return ajax(`${config.serverUrl}${layerGroupUrn}`)
        .then(json => {

            json.items.forEach(item => {
                let groupModel = new GroupModel(item)
                groupCollection.set(groupModel.id, groupModel)
            })

            return groupCollection
        })
}

function fetchStates() {

    return ajax(`${config.serverUrl}${stateUrn}`)
        .then(json => {

            json.items.forEach(item => {
                let stateModel = new StateModel(item)
                stateCollection.set(stateModel.alias, stateModel)
            })

            return {}
        })
}

export function getMap() {
    return map
}

export function getLayerGroupCollection() {
    return layerGroupCollection
}

export function getLayerCollection() {
    return layerCollection
}

export function getGuidToLayerMap() {
    return guidToLayerMap
}

export function getStates() {
    return stateCollection
}

export function init() {

    Promise.all([
        fetchStates()
    ]).then(args => {
        Promise.all([
            fetchConfig(),
            fetchProviders(),
        ]).then(args => {
            renderMap()
            Promise.all([
                fetchLayers(),
                fetchLayerGroups()
            ]).then(args => {
                notification()
                renderMapItems()
                initMarkers()
                initCars()
                initSocketio()
                getPoints()
            })
        })
    })
}

function renderMap() {

    let mapContainer = $('#' + containerId),
        jMapCardBody = $('#map-card-body'),
        height = $(window).height() - $('header').height() - 50

    mapContainer.height(height)
    jMapCardBody.height(height)
    $('.card').css('display', 'block')

    let baseLayers = {},
        providersCount = 0

    for (let [ind, providerModel] of providerCollection) {
        baseLayers[providerModel.title] = L.tileLayer(providerModel.url, {id: providerModel.name})
        providersCount++
    }

    map = L.map(containerId, {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        },
        scrollWheelZoom: false,
        preferCanvas: true,
        center: mapModel.coordinates,
        zoom: mapModel.scale,
        layers: [baseLayers[providerCollection.get(mapModel.providerId).title]]
    })

    if (providersCount > 1) L.control.layers(baseLayers).addTo(map)

    initResizeListeners()

    // //Геолокация
    // L.control.locate({
    //     strings: {
    //         title: "Show me where I am"
    //     }
    // }).addTo(map);

    initialPositionControl(mapModel).addTo(map)

    //Координаты мыши
    L.control.coordinates({
        position: "bottomleft",
        decimals: 6,
        decimalSeperator: ".",
        labelTemplateLat: RSDU_LATITUDE.charAt(0).toUpperCase() + ": {y}",
        labelTemplateLng: RSDU_LONGITUDE.charAt(0).toUpperCase() + ": {x}"
    }).addTo(map)

    L.control.ruler({
        position: 'topleft',
        lengthUnit: {
            display: 'км',
            decimal: 2,
            factor: null,
            // label: 'Distance:'
            label: 'Расстояние:'
        },
        angleUnit: {
            display: '&deg;',
            decimal: 2,
            factor: null,
            // label: 'Bearing:'
            label: 'Азимут:'
        }
    }).addTo(map);
}

function renderMapItems() {

    for (let [key, layerModel] of layerCollection) {

        let state = stateCollection.get(layerModel.stateAlias),
            color = state.color ? '#' + state.color : undefinedColor,
            layerGroup = L.featureGroup()

        layerGroup.addTo(map)

        if (layerModel.alias === CARS_LAYER_ALIAS) carsLayerGroup = layerGroup
        else if (layerModel.alias === 'MARKERS') markersLayerGroup = layerGroup

        layerGroupCollection.set(layerModel.id, layerGroup);

        if (layerModel.kml === null) continue

        L.geoJSON(layerModel.kml, {

            style: function (feature) {
                return {color: color}
            },

            pointToLayer: function (feature, latlng) {

                return L.circleMarker(latlng, {
                    fillColor: 'white',
                    fillOpacity: 1,
                    radius: feature.properties.type === 'circle' && feature.properties.radius !== undefined ? feature.properties.radius : pillarRadius,
                    weight: 1
                })
            },
            onEachFeature: function (feature, leafletLayer) {

                leafletLayer.rsduLayerModel = layerModel

                //При создании фигуры она копирует статус группы
                leafletLayer.stateAlias = layerModel.stateAlias

                guidToLayerMap.set(feature.properties.guid, leafletLayer)

                bindSelectingLayer(feature, leafletLayer)
                bindPopup(feature, leafletLayer)
            }
        }).addTo(layerGroupCollection.get(layerModel.id))
    }

    let layerMenu = new LayerMenu({
        layerCollection: layerCollection,
        groupCollection: groupCollection
    });

    layerMenu.render();

    initLayerStates()
}

function initResizeListeners() {

    let jMapCardBody = $('#map-card-body'),
        jRsduMapContainer = $('#rsdu-map-container'),
        oldCardHeight = jMapCardBody.height()

    jMapCardBody.on('mouseup', function () {
        let height = $(this).height()

        if (height === oldCardHeight) return

        oldCardHeight = height
        jRsduMapContainer.height(height)
        map.invalidateSize();
    });

}

function initLayerStates() {

    ajax(`${config.serverUrl}${layerStatesUrn}`)
        .then(json => {
            json.items.forEach((item) => {
                changeState(item)
            })
        })
}

function getPopupContent(feature, leafletLayer) {

    let popupHtml = "",
        card = getCard(),
        layerModel = leafletLayer.rsduLayerModel,
        //ВАЖНО: отображается статус фигуры, а не группы
        state = stateCollection.get(leafletLayer.stateAlias)

    if (layerModel.name) popupHtml += `<tr><td align="right"><strong>${card.get('layer')}:&nbsp;</strong></td><td class="text-nowrap">${layerModel.name}</td></tr>`

    for (let key of card.keys()) {
        if (!feature.properties.hasOwnProperty(key)) continue
        popupHtml += `<tr><td align="right"><strong>${card.get(key)}:&nbsp;</strong></td><td class="text-nowrap">${feature.properties[key]}</td></tr>`
    }

    popupHtml += `<tr><td align="right"><strong>${RSDU_LAYER_CARD_STATE}:&nbsp;</strong></td><td class="text-nowrap">${state.name}</td></tr>`

    return `<table border="0">${popupHtml}</table>`
}

function bindPopup(feature, leafletLayer) {

    leafletLayer.on('click', function () {
        leafletLayer.setPopupContent(getPopupContent(feature, leafletLayer))
    })

    leafletLayer.bindPopup('', {maxWidth: config.popupMaxWidth})
}

function bindSelectingLayer(feature, leafletLayer) {

    leafletLayer.on('popupopen', () => {
        activateLayer(feature, leafletLayer)
    })

    leafletLayer.on('popupclose', () => {
        deactivateLayer(feature, leafletLayer)
    })
}

function activateLayer(feature, leafletLayer) {

    let state = stateCollection.get('Selected'),
        color = state.color ? '#' + state.color : '#800000',
        fillColor = state.fillColor ? `#${state.fillColor}` : '#800000'

    leafletLayer.setStyle({color: color, fillColor: fillColor})
    leafletLayer.bringToFront()
}

function deactivateLayer(feature, leafletLayer) {

    let state = stateCollection.get(leafletLayer.stateAlias),
        color = state.color ? '#' + state.color : undefinedColor,
        fillColor = state.fillColor ? `#${state.fillColor}` : 'white'

    leafletLayer.setStyle({color: color, fillColor: fillColor})
}

export function changeState(date) {

    let leafletLayer = guidToLayerMap.get(date.guid),
        state,
        color,
        fillColor = 'white'

    if (!leafletLayer) return

    state = stateCollection.get(date.state)
    color = state.color ? '#' + state.color : undefinedColor

    if (!state) return
    if (state.fillColor) fillColor = `#${state.fillColor}`

    leafletLayer.stateAlias = state.alias

    leafletLayer.setStyle({color: color, fillColor: fillColor})
    leafletLayer.bringToFront()
}

/**
 * Для генерации координат
 */
function getPoints() {
    //http://192.168.8.74/?getpoints=4&addfirst=1
    let url_string = window.location.href,
        url = new URL(url_string),
        count = parseInt(url.searchParams.get("getpoints")),
        addfirst = parseInt(url.searchParams.get("addfirst")),
        increment = 1,
        first = '',
        buffer = '',
        coords = ''

    if (isNaN(count)) return

    let map = getMap()
    map.on('mouseup', (e) => {

        coords = `${e.latlng.lng},${e.latlng.lat},0 `
        buffer += coords
        if (increment === 1) first = coords

        if (increment === count) {

            if (addfirst === 1) buffer += first

            console.log(buffer)
            prompt('Coordinates', buffer)

            increment = 0
            buffer = ''
        }

        increment++
    })
}
