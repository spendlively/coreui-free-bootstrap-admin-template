import {getCookie} from "../cookie/cookie";
import {initUser} from "../user/user";

export function init() {

    check();
    initUser()
}

export function check() {
    getCookie('sessionKey') || login()
}

export function login() {
    window.location.replace('/login.html')
}

export function logout() {
    document.cookie = 'sessionKey=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    login()
}
