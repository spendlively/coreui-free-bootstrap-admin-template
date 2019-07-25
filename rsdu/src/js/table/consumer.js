import { ajax } from '../ajax/ajax'
import { searchCustomerUrn } from '../ajax/urn'
import config from '../config/config'

let prevSearches = {}

export function initCustomerSearch(id, searchFunction) {

    let jCustomerField = $(id)

    jCustomerField
        .unbind('keyup')
        .keyup(function (event) {

            let searchStr = $(this)
                .val()
            if (!searchStr) {
                return
            }
            if (searchStr === prevSearches[id]) {
                return
            }

            searchFunction(searchStr)
            prevSearches[id] = searchStr
        })
}

export function getConsumer(searchStr) {

    return ajax(`${config.serverUrl}${searchCustomerUrn}`, {
        method: 'POST',
        body: JSON.stringify({
            'q': searchStr
        })
    })
        .then(function (json) {
            return json.items
        })
}