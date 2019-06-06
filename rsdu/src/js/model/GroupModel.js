export default class GroupModel {

    constructor(options) {
        this.count = parseInt(options.count) || 0
        this.id = parseInt(options.id) || 0
        this.sortorder = parseInt(options.sortorder) || 0
        this.name = options.name || ''
        this.subgroups = options.subgroups || []
    }
}
