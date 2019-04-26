export default class User {

    constructor(options) {

        this.avatar = options.avatar || ''
        this.id = parseInt(options.id) || 0
        this.login = options.login || ''
        this.name = options.name || ''
    }

}
