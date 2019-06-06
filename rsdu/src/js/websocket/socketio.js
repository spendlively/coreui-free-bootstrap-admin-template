import io from 'socket.io-client'
import { changeState } from '../map/map'
import { addMarker, removeMarkerByGuid } from '../marker/marker'
import MarkerModel from '../model/MarkerModel'
import MessageModel from '../model/MessageModel'
import { addMessage } from '../notification/notification'
import {getCarDescriptionMap, removeCarByGuid, setCar} from "../car/car";
import CarModel from "../model/CarModel";

let socket = null

export function init() {

  let address = window.location.protocol + '//' + window.location.host

  socket = io(address)
  window.rsdu_socket = socket

  socket.on('connect', () => {
    socket.emit('client_connected', { data: 'OMS client connected!' })
  })

  socket.on('state-changed', function (json) {
    json.items.forEach((data) => {
      changeState(data)
    })
  })

  socket.on('notify', function (json) {
    json.forEach((data) => {
      addMessage(new MessageModel(data))
    })
  })

  socket.on('marker-set', function (json) {
    json.forEach((data) => {
      addMarker(new MarkerModel(data))
    })
  })

  socket.on('marker-remove', function (json) {
    json.forEach((guid) => {
      removeMarkerByGuid(guid)
    })
  })


  socket.on('car-set', function (json) {
    json.forEach((data) => {
      let carDescriptionModel = getCarDescriptionMap().get(data.guid)

      if(!carDescriptionModel) return

      data.descriptionModel = carDescriptionModel
      let carModel = new CarModel(data)

      setCar(carModel)
    })
  })

  socket.on('car-remove', function (json) {
    json.forEach((guid) => {
      removeCarByGuid(guid)
    })
  })
}
