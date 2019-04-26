export default class State {

    constructor(options) {

        this.color = options.color || 'black'
        this.id = parseInt(options.id) || 0
        this.name = options.name || ''
    }
}
