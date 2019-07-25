import config from '../config/config'
import * as dateformat from 'dateformat'
import { ajax } from '../ajax/ajax'
import { updateDemandUrn } from '../ajax/urn'
import {RSDU_DEMAND_NO_DATE_ERROR } from '../l10n/lang/ruRu'
import CustomerModel from '../model/CustomerModel'
import { getAddress, initAddressSearch } from './address'
import { getConsumer, initCustomerSearch } from './consumer'
import { showErrorModal } from './error'
import { getDemandMap, getDemandStateMap, loadTable } from './table'

let addressesCount = 5,
    consumersCount = 5,
    selectedCustomerModel = null

export function init() {
    initClickOnRow()
    initStateSelect()
    initSubmit()
    initCustomerSearch('#rsdu-table-update-consumer', searchConsumer)
    initAddressSearch('#rsdu-table-update-address', searchAddress)
}

/**
 * Смена статуса в форме
 */
function initStateSelect() {

    let jContainer = $('#rsdu-table-update-state-container')

    jContainer.find('a.dropdown-item')
        .unbind('click')
        .click(function (e) {

            e.preventDefault()

            let stateId = parseInt($(this)
                .attr('data-state-id'))

            if (isNaN(stateId)) {
                return
            }

            updateFormState(getDemandStateMap()
                .get(stateId))
        })
}

function initSubmit() {

    let jModal = $('#rsdu-table-update-modal')

    jModal.find('.rsdu-table-update-submit')
        .unbind('mousedown')
        .mousedown(function (e) {

            e.preventDefault()

            let id = parseInt(jModal.find('#rsdu-table-update-id')
                .val())
            if (isNaN(id)) {
                return
            }
            let demandModel = getDemandMap()
                .get(id)

            if (!demandModel) {
                return
            }

            let dt = jModal.find('#rsdu-table-update-date')
                    .val(),
                address = jModal.find('#rsdu-table-update-address')
                    .val(),
                customerFieldValue = jModal.find('#rsdu-table-update-consumer')
                    .val()
                    .trim(),
                phone = jModal.find('#rsdu-table-update-phone')
                    .val(),
                description = jModal.find('#rsdu-table-update-desc')
                    .val(),
                stateId = parseInt(jModal.find('#rsdu-table-update-state')
                    .attr('data-state')),
                stateModel = isNaN(stateId) ? null : getDemandStateMap()
                    .get(stateId),
                date = new Date(dt),
                customerModel = selectedCustomerModel ? selectedCustomerModel : demandModel.customer

            if(!dt){
                showErrorModal(RSDU_DEMAND_NO_DATE_ERROR)
                return
            }

            if (customerFieldValue !== customerModel.name) {
                customerModel = new CustomerModel({ name: customerFieldValue })
            }

            demandModel.timestamp = +date
            demandModel.date = date
            demandModel.demandAddress = address
            demandModel.customer = customerModel
            demandModel.demandPhone = phone
            demandModel.description = description
            demandModel.state = stateModel

            ajax(`${config.serverUrl}${updateDemandUrn}${demandModel.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'customer': demandModel.customer.name,
                    'customer_id': demandModel.customer.id,
                    'description': demandModel.description,
                    'state_id': demandModel.state.id,
                    'demand_address': demandModel.demandAddress,
                    'demand_phone': demandModel.demandPhone
                })
            })
                .then(json => {
                    console.log(json)
                    if (json.status === 'Ok') {
                        getDemandMap().clear()
                        loadTable()
                        jModal.modal('hide')
                    } else if (json.status === 'Error') {
                        showErrorModal(json.message)
                    }
                })
        })
}

function updateFormState(stateModel) {

    let jInput = $('#rsdu-table-update-state')
    for (let [key, sm] of getDemandStateMap()) {
        jInput.removeClass(sm.cls)
    }

    jInput.addClass(stateModel.cls)
        .val(stateModel.name)
        .attr('data-state', stateModel.id)
}

export function showUpdateForm(demandModel) {

    let date = `${dateformat(demandModel.date, 'yyyy-mm-dd')}T${dateformat(demandModel.date, 'HH:MM')}`,
        jModal = $('#rsdu-table-update-modal')

    jModal.find('#rsdu-table-update-id')
        .val(demandModel.id)
    jModal.find('#rsdu-table-update-date')
        .val(date)
    jModal.find('#rsdu-table-update-address')
        .val(demandModel.demandAddress)
    jModal.find('#rsdu-table-update-consumer')
        .val(demandModel.customer.name)
    jModal.find('#rsdu-table-update-phone')
        .val(demandModel.demandPhone)
    jModal.find('#rsdu-table-update-desc')
        .val(demandModel.description)
    updateFormState(demandModel.state)

    jModal.modal('show')
}

function initClickOnRow() {

    $('.rsdu-call-table tbody tr')
        .unbind('click')
        .click(function (el) {

            let id = parseInt($(this)
                .find('td.rsdu-row-id')
                .html())

            if (isNaN(id)) {
                return
            }

            showUpdateForm(getDemandMap()
                .get(id))
        })
}

function searchAddress(searchStr) {

    getAddress(searchStr)
        .then((items) => {

            let jList = $('#rsdu-table-update-address-dropdown-menu')
                .html('')

            if (items.length === 0) {
                return
            }

            for (let i = 0; i < items.length && i < addressesCount; i++) {

                let item = items[i],
                    address = `${item.locality_type}. ${item.locality}, ${item.type}. ${item.name}`

                let jListEl = $(`<a class="dropdown-item" href="#" >${address}</a>`)
                    .click(function (e) {
                        e.preventDefault()
                        $('#rsdu-table-update-address')
                            .val(address)
                    })
                jList.append(jListEl)
            }

            //Открыть dropdown
            if (!$('#rsdu-table-update-address-dropdown-menu')
                .hasClass('show')) {
                jList.dropdown('toggle')
            }
        })
}

function searchConsumer(searchStr) {

    getConsumer(searchStr)
        .then(function (items) {

            let jList = $('#rsdu-table-update-consumer-dropdown-menu')
                .html('')

            if (items.length === 0) {
                return
            }

            for (let i = 0; i < items.length && i < consumersCount; i++) {

                let customerModel = new CustomerModel(items[i])

                let jListEl = $(`<a class="dropdown-item" href="#" >${customerModel.name}</a>`)
                    .click(function (e) {
                        e.preventDefault()
                        selectedCustomerModel = customerModel
                        $('#rsdu-table-update-consumer')
                            .val(customerModel.name)
                    })
                jList.append(jListEl)
            }

            //Открыть dropdown
            if (!$('#rsdu-table-update-consumer-dropdown-menu')
                .hasClass('show')) {
                jList.dropdown('toggle')
            }
        })
}
