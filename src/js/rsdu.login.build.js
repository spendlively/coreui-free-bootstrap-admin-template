/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./rsdu/src/js/login.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./rsdu/src/js/ajax/ajax.js":
/*!**********************************!*\
  !*** ./rsdu/src/js/ajax/ajax.js ***!
  \**********************************/
/*! exports provided: ajax */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ajax\", function() { return ajax; });\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/config */ \"./rsdu/src/js/config/config.js\");\n/* harmony import */ var _cookie_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../cookie/cookie */ \"./rsdu/src/js/cookie/cookie.js\");\n\n\n\nfunction isObject(value) {\n    return value && typeof value === 'object' && value.constructor === Object;\n}\n\nfunction assign(left, right) {\n\n    for (let prop in right) {\n        if (!right.hasOwnProperty(prop)) continue\n\n        left[prop] = isObject(right[prop]) && isObject(left[prop])\n            ? assign(left[prop], right[prop])\n            : right[prop]\n    }\n\n    return left\n}\n\nfunction ajax(url, opts) {\n\n    let options = assign({\n        headers: {\n            \"Session-Key\": Object(_cookie_cookie__WEBPACK_IMPORTED_MODULE_1__[\"getCookie\"])('sessionKey'),\n            \"Accept-Language\": _config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].acceptLanguage\n        }\n    }, opts)\n\n    return fetch(url, options)\n        .then(function (response) {\n            return response.json()\n        })\n}\n\n\n//# sourceURL=webpack:///./rsdu/src/js/ajax/ajax.js?");

/***/ }),

/***/ "./rsdu/src/js/ajax/urn.js":
/*!*********************************!*\
  !*** ./rsdu/src/js/ajax/urn.js ***!
  \*********************************/
/*! exports provided: searchUrn, loginUrn, userUrn, mapModelUrn, providerUrn, layerListUrn, layerGroupUrn, stateUrn, layerStatesUrn, notifyListUrn, markerListUrn, carsDescriptionListUrn, carsListUrn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"searchUrn\", function() { return searchUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loginUrn\", function() { return loginUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"userUrn\", function() { return userUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"mapModelUrn\", function() { return mapModelUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"providerUrn\", function() { return providerUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"layerListUrn\", function() { return layerListUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"layerGroupUrn\", function() { return layerGroupUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"stateUrn\", function() { return stateUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"layerStatesUrn\", function() { return layerStatesUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"notifyListUrn\", function() { return notifyListUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"markerListUrn\", function() { return markerListUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"carsDescriptionListUrn\", function() { return carsDescriptionListUrn; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"carsListUrn\", function() { return carsListUrn; });\n\nconst searchUrn      = '/rsdu/oms/api/gis/object/search'\nconst loginUrn       = '/rsdu/oms/api/user/login/'\nconst userUrn        = '/rsdu/oms/api/user/'\nconst mapModelUrn   = '/rsdu/oms/api/gis/user_map/list/'\nconst providerUrn    = '/rsdu/oms/api/gis/map_provider/list/'\nconst layerListUrn   = '/rsdu/oms/api/gis/layer/list/'\nconst layerGroupUrn  = '/rsdu/oms/api/gis/layer_group/list/'\nconst stateUrn       = '/rsdu/oms/api/gis/object/state/list/'\nconst layerStatesUrn = '/rsdu/oms/api/gis/object/state/'\nconst notifyListUrn = '/rsdu/oms/api/gis/notify/list'\nconst markerListUrn = '/rsdu/oms/api/gis/marker/list'\nconst carsDescriptionListUrn = '/rsdu/oms/api/gis/cars/list/'\nconst carsListUrn = '/rsdu/oms/api/gis/cars/coordinates/'\n\n\n//# sourceURL=webpack:///./rsdu/src/js/ajax/urn.js?");

/***/ }),

/***/ "./rsdu/src/js/config/config.js":
/*!**************************************!*\
  !*** ./rsdu/src/js/config/config.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst config = {\n    acceptLanguage: 'ru-RU',\n    webSocketServerPort: '8888',\n    serverUrl: '',\n    popupMaxWidth: 500,\n    // serverUrl: 'http://192.168.117.74',\n    // serverUrl: 'http://192.168.20.107:8084',\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (config);\n\n\n//# sourceURL=webpack:///./rsdu/src/js/config/config.js?");

/***/ }),

/***/ "./rsdu/src/js/cookie/cookie.js":
/*!**************************************!*\
  !*** ./rsdu/src/js/cookie/cookie.js ***!
  \**************************************/
/*! exports provided: getCookie */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCookie\", function() { return getCookie; });\nfunction getCookie(name){\n    var matches = document.cookie.match(new RegExp(\n        \"(?:^|; )\" + name.replace(/([\\.$?*|{}\\(\\)\\[\\]\\\\\\/\\+^])/g, '\\\\$1') + \"=([^;]*)\"\n    ));\n    return matches ? decodeURIComponent(matches[1]) : null;\n}\n\n\n//# sourceURL=webpack:///./rsdu/src/js/cookie/cookie.js?");

/***/ }),

/***/ "./rsdu/src/js/l10n/lang/ruRu.js":
/*!***************************************!*\
  !*** ./rsdu/src/js/l10n/lang/ruRu.js ***!
  \***************************************/
/*! exports provided: RSDU_TITLE, RSDU_LOGIN_FORM_TITLE, RSDU_LOGIN_FORM_DESC, RSDU_LOGIN_FORM_SUMBIT, RSDU_LOGIN_FORM_FORGOT, RSDU_LOGIN_FORM_USERNAME, RSDU_LOGIN_FORM_PASSWORD, RSDU_LOGOUT_BTN, RSDU_SEARCH_PLACEHOLDER, RSDU_COPYRIGHTS_PRODUCT, RSDU_COPYRIGHTS_COMPANY, RSDU_LAYER_CARD_LAYER, RSDU_LAYER_CARD_NAME, RSDU_LAYER_CARD_DESC, RSDU_LAYER_CARD_KTP, RSDU_LAYER_CARD_LATITUDE, RSDU_LAYER_CARD_LONGITUDE, RSDU_LAYER_CARD_STATE, RSDU_NOTIFICATION_TODAY, RSDU_NOTIFICATION_YESTERDAY, RSDU_LATITUDE, RSDU_LONGITUDE, RSDU_LAYER_CARD_CAR_ID, RSDU_LAYER_CARD_PHONE, RSDU_LAYER_CARD_TIME, RSDU_LAYER_CARD_VLCT, RSDU_LAYER_CARD_VLCT_UNIT, RSDU_LAYER_CARD_CRC */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_TITLE\", function() { return RSDU_TITLE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LOGIN_FORM_TITLE\", function() { return RSDU_LOGIN_FORM_TITLE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LOGIN_FORM_DESC\", function() { return RSDU_LOGIN_FORM_DESC; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LOGIN_FORM_SUMBIT\", function() { return RSDU_LOGIN_FORM_SUMBIT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LOGIN_FORM_FORGOT\", function() { return RSDU_LOGIN_FORM_FORGOT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LOGIN_FORM_USERNAME\", function() { return RSDU_LOGIN_FORM_USERNAME; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LOGIN_FORM_PASSWORD\", function() { return RSDU_LOGIN_FORM_PASSWORD; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LOGOUT_BTN\", function() { return RSDU_LOGOUT_BTN; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_SEARCH_PLACEHOLDER\", function() { return RSDU_SEARCH_PLACEHOLDER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_COPYRIGHTS_PRODUCT\", function() { return RSDU_COPYRIGHTS_PRODUCT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_COPYRIGHTS_COMPANY\", function() { return RSDU_COPYRIGHTS_COMPANY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_LAYER\", function() { return RSDU_LAYER_CARD_LAYER; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_NAME\", function() { return RSDU_LAYER_CARD_NAME; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_DESC\", function() { return RSDU_LAYER_CARD_DESC; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_KTP\", function() { return RSDU_LAYER_CARD_KTP; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_LATITUDE\", function() { return RSDU_LAYER_CARD_LATITUDE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_LONGITUDE\", function() { return RSDU_LAYER_CARD_LONGITUDE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_STATE\", function() { return RSDU_LAYER_CARD_STATE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_NOTIFICATION_TODAY\", function() { return RSDU_NOTIFICATION_TODAY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_NOTIFICATION_YESTERDAY\", function() { return RSDU_NOTIFICATION_YESTERDAY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LATITUDE\", function() { return RSDU_LATITUDE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LONGITUDE\", function() { return RSDU_LONGITUDE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_CAR_ID\", function() { return RSDU_LAYER_CARD_CAR_ID; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_PHONE\", function() { return RSDU_LAYER_CARD_PHONE; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_TIME\", function() { return RSDU_LAYER_CARD_TIME; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_VLCT\", function() { return RSDU_LAYER_CARD_VLCT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_VLCT_UNIT\", function() { return RSDU_LAYER_CARD_VLCT_UNIT; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RSDU_LAYER_CARD_CRC\", function() { return RSDU_LAYER_CARD_CRC; });\nconst RSDU_TITLE = 'РСДУ5 Управление аварийными отключениями'\nconst RSDU_LOGIN_FORM_TITLE = 'РСДУ5 OMS'\nconst RSDU_LOGIN_FORM_DESC = 'Введите имя и пароль'\nconst RSDU_LOGIN_FORM_SUMBIT = 'Войти'\nconst RSDU_LOGIN_FORM_FORGOT = 'Забыли пароль'\nconst RSDU_LOGIN_FORM_USERNAME = 'Имя'\nconst RSDU_LOGIN_FORM_PASSWORD = 'Пароль'\nconst RSDU_LOGOUT_BTN = 'Выйти'\nconst RSDU_SEARCH_PLACEHOLDER = '⌕ Поиск'\nconst RSDU_COPYRIGHTS_PRODUCT = 'РСДУ5-OMS'\nconst RSDU_COPYRIGHTS_COMPANY = '© 2019 ЭМА'\nconst RSDU_LAYER_CARD_LAYER = 'Слой'\nconst RSDU_LAYER_CARD_NAME = 'Наименование'\nconst RSDU_LAYER_CARD_DESC = 'Описание'\nconst RSDU_LAYER_CARD_KTP = 'КТП'\nconst RSDU_LAYER_CARD_LATITUDE = 'Широта'\nconst RSDU_LAYER_CARD_LONGITUDE = 'Долгота'\nconst RSDU_LAYER_CARD_STATE = 'Статус'\nconst RSDU_NOTIFICATION_TODAY = 'Сегодня'\nconst RSDU_NOTIFICATION_YESTERDAY = 'Вчера'\nconst RSDU_LATITUDE = 'широта'\nconst RSDU_LONGITUDE = 'долгота'\nconst RSDU_LAYER_CARD_CAR_ID = 'Госномер'\nconst RSDU_LAYER_CARD_PHONE = 'Телефон'\nconst RSDU_LAYER_CARD_TIME = 'Время'\nconst RSDU_LAYER_CARD_VLCT = 'Скорость'\nconst RSDU_LAYER_CARD_VLCT_UNIT = 'км/ч'\nconst RSDU_LAYER_CARD_CRC = 'Курс'\n\n\n//# sourceURL=webpack:///./rsdu/src/js/l10n/lang/ruRu.js?");

/***/ }),

/***/ "./rsdu/src/js/login.js":
/*!******************************!*\
  !*** ./rsdu/src/js/login.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/config */ \"./rsdu/src/js/config/config.js\");\n/* harmony import */ var _ajax_ajax__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ajax/ajax */ \"./rsdu/src/js/ajax/ajax.js\");\n/* harmony import */ var _ajax_urn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ajax/urn */ \"./rsdu/src/js/ajax/urn.js\");\n/* harmony import */ var _l10n_l10n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./l10n/l10n */ \"./rsdu/src/js/l10n/lang/ruRu.js\");\n\n\n\n\n\n\nfunction login() {\n\n    let userLogin = document.getElementById(\"rsdu-login\").value;\n    let password = document.getElementById(\"rsdu-password\").value;\n\n    Object(_ajax_ajax__WEBPACK_IMPORTED_MODULE_1__[\"ajax\"])(`${_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].serverUrl}${_ajax_urn__WEBPACK_IMPORTED_MODULE_2__[\"loginUrn\"]}?login=${userLogin}&password=${password}`)\n        .then(function (json) {\n\n            if(json.status === \"Error\"){\n\n                let modal = $('#loginErrorModal'),\n                    modalBody = modal.find('.modal-body')\n\n                modalBody.html(json.message)\n                modal.modal('show');\n\n                console.log('Login Failed', json)\n            }\n            else{\n                document.cookie = \"sessionKey=\" + json.session_key\n                window.location.replace('/')\n            }\n        })\n        .catch(function (ex) {\n            console.log('parsing failed', ex)\n        });\n}\n\nfunction keyPressHandler(event){\n    let keycode = (event.keyCode ? event.keyCode : event.which)\n    if(keycode === 13) login()\n}\n\n//Локализация\ndocument.title = _l10n_l10n__WEBPACK_IMPORTED_MODULE_3__[\"RSDU_TITLE\"]\n$('#rsdu-login-form-title').html(_l10n_l10n__WEBPACK_IMPORTED_MODULE_3__[\"RSDU_LOGIN_FORM_TITLE\"])\n$('#rsdu-login-form-desc').html(_l10n_l10n__WEBPACK_IMPORTED_MODULE_3__[\"RSDU_LOGIN_FORM_DESC\"])\n$('#rsdu-login-form-forgot').html(_l10n_l10n__WEBPACK_IMPORTED_MODULE_3__[\"RSDU_LOGIN_FORM_FORGOT\"])\n$('#rsdu-login-btn').html(_l10n_l10n__WEBPACK_IMPORTED_MODULE_3__[\"RSDU_LOGIN_FORM_SUMBIT\"]).click(function(event){login()})\n$('#login-card').animate({opacity: 1}, 500);\n$('#rsdu-login').attr({placeholder: _l10n_l10n__WEBPACK_IMPORTED_MODULE_3__[\"RSDU_LOGIN_FORM_USERNAME\"]}).keypress(keyPressHandler)\n$('#rsdu-password').attr({placeholder: _l10n_l10n__WEBPACK_IMPORTED_MODULE_3__[\"RSDU_LOGIN_FORM_PASSWORD\"]}).keypress(keyPressHandler)\n\n\n//# sourceURL=webpack:///./rsdu/src/js/login.js?");

/***/ })

/******/ });