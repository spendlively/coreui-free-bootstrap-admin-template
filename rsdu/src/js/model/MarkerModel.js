export default class MarkerModel {

    constructor(options) {
        this.guid = options.guid || null
        this.icon = options.icon || ''
        this.lat = options.lat || 0
        this.lng = options.lng || 0
        this.name = options.name || ''
        this.timestamp = options.timestamp || null
        this.date = this.timestamp ? new Date(this.timestamp * 1000) : null
        this.leafletLayer = options.leafletLayer || null
    }
}
