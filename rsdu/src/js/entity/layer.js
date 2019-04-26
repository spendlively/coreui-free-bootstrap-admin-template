export default class Layer {

    constructor(options) {
        this.enabled = parseInt(options.enabled) || 0
        this.id = parseInt(options.id) || 0
        this.sortorder = parseInt(options.sortorder) || 0
        this.subgroupId = parseInt(options.subgroup_id) || 0
        this.kml = options.kml || {}
        this.name = options.name || ''
    }
}
