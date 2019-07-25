import {ajax} from '../ajax/ajax'
import {notifyListUrn} from '../ajax/urn'
import config from '../config/config'
import {RSDU_NOTIFICATION_TODAY, RSDU_NOTIFICATION_YESTERDAY} from '../l10n/l10n'
import MessageModel from '../model/MessageModel'
import {getStates} from '../map/map'
import dateformat from 'dateformat'
import {getBadges, setBadges, clearBadges, isMessagesPanelOpened, addBadges} from '../badge/badge'

let messagesMap = new Map(),
    midnightResetIsDone = false

export function init() {

    fetchMessagesData()

    $('#rsdu-messages-bell')
        .click(() => {
            /**
             * Во время срабатывания события click при открывании,
             * боковая панель все еще закрыта, поэтому, счетчик обнуляется
             * по признаку закрытости, а не открытости
             */
            if (!isMessagesPanelOpened()) {
                clearBadges()
            }
        })

    /**
     * Таймер для сброса списка сообщений в 00:00
     */
    setInterval(() => {

        if (midnightResetIsDone === false && dateformat(new Date(), 'HH:MM') === '00:00') {

            console.log('Midnight reset ...')
            let badgesCount = getBadges()
            clearMessagesData()
            console.log('Messages removed')
            midnightResetIsDone = true

            console.log('Fetch new messages...')
            fetchMessagesData(() => {
                //Восстанавливаю прежнее количество непрочитанных сообщений
                setBadges(badgesCount)
            })
            console.log('Done')

            setTimeout(() => {
                midnightResetIsDone = false
            }, 100 * 1000)
        }
    }, 10 * 1000)
}

function clearMessagesData() {
    messagesMap = new Map()
    $('#rsdu-messages')
        .empty()
    clearBadges()
}

function fetchMessagesData(callback) {

    ajax(`${config.serverUrl}${notifyListUrn}`)
        .then(json => {
            json.forEach((data) => {
                addMessage(new MessageModel(data))
            })

            if(typeof(callback) === 'function') callback()
        })
}

function getContainerId(date) {
    return 'rsdu-messages-' + dateformat(date, 'ddmmyyyy')
}

export function addMessage(messageModel, addOnTop = false) {

    let containerId = getContainerId(messageModel.date),
        todayDate = new Date().getDate(),
        yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1)).getDate(),
        jContainer = $(`#${containerId}`),
        headerTitle

    if (messageModel.date.getDate() === todayDate) {
        headerTitle = RSDU_NOTIFICATION_TODAY
    } else if (messageModel.date.getDate() === yesterdayDate) {
        headerTitle = RSDU_NOTIFICATION_YESTERDAY
    } else {
        headerTitle = dateformat(messageModel.date, 'dd.mm.yyyy')
    }

    if (jContainer.length === 0) {
        $('#rsdu-messages')
            .append($(getMessageHeaderHtml(headerTitle, containerId)))
    }

    let jHtml = $(getMessageHtml(messageModel))
    if(addOnTop){
        jContainer.prepend(jHtml)
    } else {
        jContainer.append(jHtml)
    }

    addBadges(1)
}

function getMessageHeaderHtml(messageHeader, id) {

    id = id ? `id="${id}"` : ''

    return `<div class="list-group-item list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
    ${messageHeader}
  </div>
  <div ${id}></div>
`
}

function getMessageHtml(messageModel) {

    return `<div class="list-group-item list-group-item-divider" ${getStyleByState(messageModel.state)}>
        <div class="avatar float-right"></div>
        <div>${messageModel.notify}
            <strong>${messageModel.equipmentName}</strong>
        </div>
        <small class="text-muted mr-3">
            <i class="icon-calendar"></i>&nbsp; ${dateformat(messageModel.date, 'HH:MM:ss')}
        </small>
        <br>
        <small class="text-muted">
            <i class="icon-location-pin rsdu-cursor-pointer" onclick="rsduShowLayerByGuid('${messageModel.objectGuid}', '')"></i>&nbsp; ${messageModel.objectName}
        </small>
    </div>`
}

function getStyleByState(stateAlias) {

    let stateCollection = getStates(),
        stateModel = stateCollection.get(stateAlias) || {color: '000000'}

    return `style = "border-left: 4px solid #${stateModel.color};"`
}
