import $ from "jquery";
import config from "../config/config";
import {logout} from "../auth/auth";
import {ajax} from '../ajax/ajax'
import {userUrn} from '../ajax/urn'
import User from '../entity/user'

let user,
    labelId = "rsdu-user-label",
    imgId = "rsdu-user-img",
    logoutCls = "rsdu-logout-action";

export function getUser() {
    return user;
}

export function initUser() {

    ajax(`${config.serverUrl}${userUrn}`)
        .then(function (json) {

            if(json.status === "Error") logout();

            user = new User(json)
            render();
            initEventListeners();
        })
        .catch(function (ex) {
            console.log('parsing failed', ex)
        });
}

export function initEventListeners() {

    $(`.${logoutCls}`).click(function () {
        logout();
    });
}

export function render() {

    $(`#${labelId}`).text(user.name);
    $(`#${imgId}`).attr("src", config.serverUrl + user.avatar);
}
