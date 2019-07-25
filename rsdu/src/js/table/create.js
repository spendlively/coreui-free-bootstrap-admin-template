import dateformat from 'dateformat'
import { ajax } from '../ajax/ajax'
import { createDemandUrn } from '../ajax/urn'
import config from '../config/config'
import { RSDU_DEMAND_NO_CONTACTS_ERROR, RSDU_DEMAND_NO_DESC_ERROR } from '../l10n/lang/ruRu'
import CustomerModel from '../model/CustomerModel'
import DemandModel from '../model/DemandModel'
import { getAddress, initAddressSearch } from './address'
import { getConsumer, initCustomerSearch } from './consumer'
import { showErrorModal } from './error'
import { getDemandMap, getDemandStateMap, loadTable } from './table'

let addressesCount = 5,
    consumersCount = 5,
    selectedCustomerModel = null

export function init() {

    $('.rsdu-new-demand')
        .unbind('click')
        .click(function (e) {
            e.preventDefault()
            showCreateForm()
        })

    initStateSelect()
    initSubmit()
    initCustomerSearch('#rsdu-table-create-consumer', searchConsumer)
    initAddressSearch('#rsdu-table-create-address', searchAddress)
}

export function showCreateForm() {

    let jModal = $('#rsdu-table-create-modal')

    jModal.find('#rsdu-table-create-address')
        .val('')
    jModal.find('#rsdu-table-create-consumer')
        .val('')
    jModal.find('#rsdu-table-create-phone')
        .val('')
    jModal.find('#rsdu-table-create-desc')
        .val('')
    updateFormState(getDemandStateMap().values().next().value)

    selectedCustomerModel = null

    jModal.modal('show')
}

function updateFormState(stateModel) {

    let jInput = $('#rsdu-table-create-state')
    for (let [key, sm] of getDemandStateMap()) {
        jInput.removeClass(sm.cls)
    }

    jInput.addClass(stateModel.cls)
        .val(stateModel.name)
        .attr('data-state', stateModel.id)
}

function initSubmit() {

    let jModal = $('#rsdu-table-create-modal')

    jModal.find('.rsdu-table-create-submit')
        .unbind('mousedown')
        .mousedown(function (e) {

            e.preventDefault()

            let address = jModal.find('#rsdu-table-create-address')
                    .val(),
                customerFieldValue = jModal.find('#rsdu-table-create-consumer')
                    .val()
                    .trim(),
                phone = jModal.find('#rsdu-table-create-phone')
                    .val(),
                description = jModal.find('#rsdu-table-create-desc')
                    .val(),
                stateId = parseInt(jModal.find('#rsdu-table-create-state')
                    .attr('data-state')),
                stateModel = isNaN(stateId) ? null : getDemandStateMap()
                    .get(stateId),
                date = new Date(),
                customerModel = selectedCustomerModel ? selectedCustomerModel : new CustomerModel({})

            /**
             * Должен быть указан хотябы один контакт: адрес, потребитель или телефон
             */
            if (
                address.trim() === '' &&
                customerFieldValue === '' &&
                phone.trim() === ''
            ) {
                showErrorModal(RSDU_DEMAND_NO_CONTACTS_ERROR)
                return
            }

            if (description.trim() === '') {
                showErrorModal(RSDU_DEMAND_NO_DESC_ERROR)
                return
            }

            if (customerFieldValue !== customerModel.name) {
                customerModel = new CustomerModel({ name: customerFieldValue })
            }

            let demandModel = new DemandModel({
                timestamp: +date / 1000,
                demand_address: address,
                customer: customerModel,
                demand_phone: phone,
                description: description,
                state: stateModel
            })

            ajax(`${config.serverUrl}${createDemandUrn}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'customer_id': demandModel.customer.id,
                    'customer': demandModel.customer.name,
                    'description': demandModel.description,
                    'state_id': demandModel.state.id,
                    'demand_address': demandModel.demandAddress,
                    'demand_phone': demandModel.demandPhone
                })
            })
                .then(json => {
                    if (json.status === 'Ok') {
                        demandModel.id = parseInt(json.id)
                        if (!isNaN(demandModel.id)) {
                            getDemandMap().clear()
                            loadTable()
                        }
                        jModal.modal('hide')
                    } else if (json.status === 'Error') {
                        showErrorModal(json.message)
                    }
                })
        })
}

/**
 * Смена статуса в форме
 */
function initStateSelect() {

    let jContainer = $('#rsdu-table-create-state-container')

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

function searchAddress(searchStr) {

    getAddress(searchStr)
        .then((items) => {

            let jList = $('#rsdu-table-create-address-dropdown-menu')
                .html('')

            if (items.length === 0) {
                return
            }

            for (let i = 0; i < items.length && i < addressesCount; i++) {

                let item = items[i],
                    address = `${item.locality_type}. ${item.locality}, ${item.type}. ${item.name}`,
                    jListEl = $(`<a class="dropdown-item" href="#" >${address}</a>`)
                        .click(function (e) {

                            e.preventDefault()
                            $('#rsdu-table-create-address')
                                .val(address)
                        })
                jList.append(jListEl)
            }

            //Открыть dropdown
            if (!$('#rsdu-table-create-address-dropdown-menu')
                .hasClass('show')) {
                jList.dropdown('toggle')
            }
        })
}

function searchConsumer(searchStr) {

    getConsumer(searchStr)
        .then(function (items) {

            let jList = $('#rsdu-table-create-consumer-dropdown-menu')
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
                        $('#rsdu-table-create-consumer')
                            .val(customerModel.name)
                    })
                jList.append(jListEl)
            }

            //Открыть dropdown
            if (!$('#rsdu-table-create-consumer-dropdown-menu')
                .hasClass('show')) {
                jList.dropdown('toggle')
            }
        })
}


// function createTableRow(demandModel) {
//
//     let today = dateformat(new Date(), 'ddmmyyyy') === dateformat(demandModel.date, 'ddmmyyyy'),
//         dateStr = today ? `Сегодня ${dateformat(demandModel.date, 'HH:MM:ss')}` : dateformat(demandModel.date, 'dd.mm.yyyy HH:MM:ss'),
//         jRow = $(`
//             <tr data-demand-id="${demandModel.id}">
//                 <td class="rsdu-row-id" scope="col" align="right">${demandModel.id}</td>
//                 <td scope="col" align="right">${dateStr}</td>
//                 <td scope="col">${getConsumerCellData(demandModel)}</td>
//                 <td scope="col">${sanitizeHTML(demandModel.description)}</td>
//                 <td scope="col"><span class="badge ${demandModel.state.cls}">${demandModel.state.name}</span></td>
//             </tr>
//         `)
//             .on('click', function (el) {
//                 showUpdateForm(demandModel)
//             })
//
//     $('.rsdu-call-table tbody')
//         .prepend(jRow)
// }
