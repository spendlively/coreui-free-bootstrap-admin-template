import { ajax } from '../ajax/ajax'
import { searchStreetUrn } from '../ajax/urn'
import config from '../config/config'

let prevSearches = {}

export function initAddressSearch(id, searchFunction) {

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

            prevSearches[id] = searchStr
            searchFunction(searchStr)
        })
}

export function getAddress(searchStr) {

    return ajax(`${config.serverUrl}${searchStreetUrn}`, {
        method: 'POST',
        body: JSON.stringify({
            'q': searchStr
        })
    })
        .then(function (json) {
            return json.items
        })
}
