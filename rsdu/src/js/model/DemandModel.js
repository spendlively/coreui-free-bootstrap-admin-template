export default class DemandModel {

    constructor(options) {
        this.id = isNaN(parseInt(options.id)) ? 0 : parseInt(options.id)

        this.demandAddress = options.demand_address || ''
        this.demandPhone = options.demand_phone || ''
        this.description = options.description || ''
        this.timestamp = options.timestamp || null
        this.date = this.timestamp ? new Date(this.timestamp * 1000) : null

        this.customer = options.customer || null
        this.state = options.state || null
    }
}
