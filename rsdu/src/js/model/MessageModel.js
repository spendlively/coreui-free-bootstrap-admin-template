export default class MessageModel {

  constructor(options) {
    this.equipmentGuid = options.equipment_guid || ''
    this.equipmentName = options.equipment_name || ''
    this.id = parseInt(options.id) || 0
    this.notify = options.notify || ''
    this.objectGuid = options.object_guid || ''
    this.objectName = options.object_name || ''
    this.state = options.state || ''
    this.timestamp = options.timestamp || ''
    this.date = new Date(this.timestamp * 1000)
  }
}
