import $ from "jquery";
import config from "../config/config";
import {logout} from "../auth/auth";
import {ajax} from '../ajax/ajax'
import {userUrn} from '../ajax/urn'
import UserModel from '../model/UserModel'

let userModel,
    labelId = "rsdu-user-label",
    imgId = "rsdu-user-img",
    logoutCls = "rsdu-logout-action";

export function getUser() {
    return userModel;
}

export function initUser() {

    ajax(`${config.serverUrl}${userUrn}`)
        .then(function (json) {

            if(json.status === "Error") logout();

            userModel = new UserModel(json)
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

    $(`#${labelId}`).text(userModel.name);
    $(`#${imgId}`).attr("src", config.serverUrl + userModel.avatar);
}
