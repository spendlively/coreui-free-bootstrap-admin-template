export default class DemandStateModel {

    constructor(options) {
        this.id = isNaN(parseInt(options.id)) ? 0 : parseInt(options.id)
        this.cls = options.cls || ''
        this.name = options.name || ''
    }

}
