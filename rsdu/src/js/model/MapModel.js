export default class MapModel {

    constructor(options) {
        let coords = options.coordinates || [0, 0]
        this.coordinates = [coords[1],coords[0]]
        this.name = options.name || ''
        this.providerId = parseInt(options.provider_id) || 0
        this.scale = parseInt(options.scale) || 0
        this.selected = parseInt(options.selected) || 0
        this.userId = parseInt(options.user_id) || 0
    }
}
