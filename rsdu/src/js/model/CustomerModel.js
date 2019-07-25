export default class CustomerModel {

    constructor(options) {
        this.id = isNaN(parseInt(options.id)) ? null : parseInt(options.id)
        this.guid = options.guid || null
        this.name = options.name || ''
        this.phone = options.phone || ''
    }
}
