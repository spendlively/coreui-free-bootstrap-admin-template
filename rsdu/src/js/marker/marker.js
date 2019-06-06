import dateformat from 'dateformat'
import {ajax} from '../ajax/ajax'
import {markerListUrn} from '../ajax/urn'
import config from '../config/config'
import {getMap, getMarkersLayerGroup} from '../map/map'
import MarkerModel from '../model/MarkerModel'
import L from "leaflet"

let markerMap = new Map()

export function init() {

    window.rsduShowMarkerByGuid = selectMarkerByGuid

    ajax(`${config.serverUrl}${markerListUrn}`)
        .then(json => {
            json.forEach((data) => {
                addMarker(new MarkerModel(data))
            })
        })
}

export function addMarker(markerModel) {

    let markersLayerGroup = getMarkersLayerGroup(),
        icon = L.icon({
            iconUrl: markerModel.icon,
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -33]
        });

    markerModel.leafletLayer = L.marker([markerModel.lat, markerModel.lng], {icon: icon})
        .addTo(markersLayerGroup)

    if (markerModel.name) markerModel.leafletLayer.bindPopup(markerModel.name)

    markerMap.set(markerModel.guid, markerModel)

    addMarkerMessage(markerModel)
}

export function removeMarkerByGuid(guid) {

    let markerModel = markerMap.get(guid),
        markersLayerGroup = getMarkersLayerGroup()

    if (!markerModel) return

    markersLayerGroup.removeLayer(markerModel.leafletLayer)
    markerMap.delete(guid)
    markerModel = null
}

function addMarkerMessage(markerModel) {

    let message = `
    <div class="message clearfix">
        <div class="pt-3 pb-2 mr-3 float-left">
            <div>
                <img class="rsdu-cursor-pointer" src="${markerModel.icon}" onclick="rsduShowMarkerByGuid('${markerModel.guid}')">
            </div>
        </div>
        <div>
            <small class="text-muted float-right mt-1">
                <i class="icon-calendar"></i>&nbsp; ${dateformat(markerModel.date, 'HH:MM:ss')}
            </small>
        </div>
        <div class="pt-4 pb-1">
            <div class="text-truncate font-weight-bold">${markerModel.name}</div>
        </div>
    </div>
    <hr>`

    $('#messages').append($(message))
}

export function selectMarkerByGuid(guid) {

    let markerModel = markerMap.get(guid),
        marker = markerModel.leafletLayer

    if (!markerModel) return

    getMap().panTo(marker.getLatLng())

    if (marker.getPopup()) marker.openPopup()
}
