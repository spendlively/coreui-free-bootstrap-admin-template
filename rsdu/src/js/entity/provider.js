export default class Provider {

    constructor(options) {
        this.enabled = parseInt(options.enabled) || 0
        this.id = parseInt(options.id) || 0
        this.maxScale = parseInt(options.max_scale) || 0
        this.sortorder = parseInt(options.sortorder) || 0
        this.name = options.name || ''
        this.title = options.title || ''
        this.url = options.url || ''
    }
}
