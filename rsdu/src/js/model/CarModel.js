export default class CarModel{

    constructor(options) {

        this.guid = options.guid || 0
        this.lat = options.lat || 0
        this.lng = options.lng || 0
        this.timestamp = options.timestamp
        this.date = new Date(options.timestamp * 1000)
        this.leafletLayer = options.leafletLayer || null
        this.descriptionModel = options.descriptionModel || null
        this.crc = parseInt(options.crc) || 0
        this.crcs = options.crcs || ''
        this.vlct = parseInt(options.vlct) || 0
    }

    empty(value){
        if(value !== undefined && value !== null) return false
        return true
    }

    exchange(carModel) {
        if(!this.empty(carModel.guid)) this.guid = carModel.guid
        if(!this.empty(carModel.lat)) this.lat = carModel.lat
        if(!this.empty(carModel.lng)) this.lng = carModel.lng
        if(!this.empty(carModel.leafletLayer)) this.leafletLayer = carModel.leafletLayer
        if(!this.empty(carModel.descriptionModel)) this.descriptionModel = carModel.descriptionModel
        if(!this.empty(carModel.crc)) this.crc = carModel.crc
        if(!this.empty(carModel.crcs)) this.crcs = carModel.crcs
        if(!this.empty(carModel.vlct)) this.vlct = carModel.vlct
        if(!this.empty(carModel.timestamp)){
            this.timestamp = carModel.timestamp
            this.date = new Date(this.timestamp * 1000)
        }
    }
}
