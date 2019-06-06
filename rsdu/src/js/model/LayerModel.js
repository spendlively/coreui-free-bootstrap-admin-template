export default class LayerModel {

    constructor(options) {
        this.enabled = parseInt(options.enabled) || 0
        this.id = parseInt(options.id) || 0
        this.sortorder = parseInt(options.sortorder) || 0
        this.subgroupId = parseInt(options.subgroup_id) || 0
        this.kml = options.kml || null
        this.name = options.name || ''
        this.stateAlias = options.stateAlias || 'Undefined'
        this.alias = options.alias || null
    }
}
