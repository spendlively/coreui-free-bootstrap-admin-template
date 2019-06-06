export default class CarDescriptionModel{

    constructor(options) {

        this.carId = options.car_id || ''
        this.guid = options.guid || ''
        this.icon = options.icon || ''
        this.name = options.name || ''
        this.phone = options.phone || ''
        this.typeName = options.type_name || ''
        this.wialonId = options.wialon_id || ''
    }
}
