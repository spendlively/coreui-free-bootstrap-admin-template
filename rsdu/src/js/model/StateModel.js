export default class StateModel {

    constructor(options) {

        this.alias = options.alias || null
        this.color = options.color || 'black'
        this.id = parseInt(options.id) || 0
        this.name = options.name || ''
        this.fillColor = options.fill_color || null
    }
}
