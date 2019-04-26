import config from './config/config'
import {ajax} from './ajax/ajax'
import {loginUrn} from './ajax/urn'
import {RSDU_TITLE, RSDU_LOGIN_FORM_TITLE, RSDU_LOGIN_FORM_DESC, RSDU_LOGIN_FORM_SUMBIT} from './l10n/l10n'
import {RSDU_LOGIN_FORM_FORGOT, RSDU_LOGIN_FORM_USERNAME, RSDU_LOGIN_FORM_PASSWORD} from './l10n/l10n'

function login() {

    let userLogin = document.getElementById("rsdu-login").value;
    let password = document.getElementById("rsdu-password").value;

    ajax(`${config.serverUrl}${loginUrn}?login=${userLogin}&password=${password}`)
        .then(function (json) {

            if(json.status === "Error"){

                let modal = $('#loginErrorModal'),
                    modalBody = modal.find('.modal-body')

                modalBody.html(json.message)
                modal.modal('show');

                console.log('Login Failed', json)
            }
            else{
                document.cookie = "sessionKey=" + json.session_key
                window.location.replace('/')
            }
        })
        .catch(function (ex) {
            console.log('parsing failed', ex)
        });
}

function keyPressHandler(event){
    let keycode = (event.keyCode ? event.keyCode : event.which)
    if(keycode === 13) login()
}

//Локализация
document.title = RSDU_TITLE
$('#rsdu-login-form-title').html(RSDU_LOGIN_FORM_TITLE)
$('#rsdu-login-form-desc').html(RSDU_LOGIN_FORM_DESC)
$('#rsdu-login-form-forgot').html(RSDU_LOGIN_FORM_FORGOT)
$('#rsdu-login-btn').html(RSDU_LOGIN_FORM_SUMBIT).click(function(event){login()})
$('#login-card').animate({opacity: 1}, 500);
$('#rsdu-login').attr({placeholder: RSDU_LOGIN_FORM_USERNAME}).keypress(keyPressHandler)
$('#rsdu-password').attr({placeholder: RSDU_LOGIN_FORM_PASSWORD}).keypress(keyPressHandler)
