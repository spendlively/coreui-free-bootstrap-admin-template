import config from '../config/config';
import {getCookie} from "../cookie/cookie";

function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
}

function assign(left, right) {

    for (let prop in right) {
        if (!right.hasOwnProperty(prop)) continue

        left[prop] = isObject(right[prop]) && isObject(left[prop])
            ? assign(left[prop], right[prop])
            : right[prop]
    }

    return left
}

export function ajax(url, opts) {

    let options = assign({
        headers: {
            "Session-Key": getCookie('sessionKey'),
            "Accept-Language": config.acceptLanguage
        }
    }, opts)

    return fetch(url, options)
        .then(function (response) {
            return response.json()
        })
}
