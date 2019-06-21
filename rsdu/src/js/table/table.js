import dateformat from "dateformat";
import {ajax} from "../ajax/ajax";
import config from "../config/config";
import {outageListUrn, outageStateListUrn} from "../ajax/urn";
import DemandStateModel from "../model/DemandStateModel";
import DemandModel from "../model/DemandModel";
import CustomerModel from "../model/CustomerModel";
import {RSDU_SEARCH_PLACEHOLDER} from "../l10n/l10n";

let demandStateMap = new Map(),
    demandsMap = new Map(),
    order = 'state-desc',
    page = 1,
    limit = 15,
    count = 0,
    pagesCount = 1

export function init(){

    $('#rsdu-table-search').attr('placeholder', RSDU_SEARCH_PLACEHOLDER)

    fetchStates()
        .then(args => {
            return fetchDemands()
        })
        .then(args => {
            initStateSelect()
            initSave()
            fetchRows()
        })
}

function fetchStates() {

    return ajax(`${config.serverUrl}${outageStateListUrn}`)
        .then(items => {
            items.forEach(item => {
                let outageStateModel = new DemandStateModel(item)
                demandStateMap.set(outageStateModel.id, outageStateModel)
            })
            return {}
        })
}

function fetchDemands() {

    return ajax(`${config.serverUrl}${outageListUrn}?order=${order}&page=${page}&limit=${limit}`)
        .then(json => {

            count = parseInt(json.count)
            count = isNaN(count) ? 0 : count

            json.items.sort((a, b) => {
                return a.timestamp > b.timestamp ? -1 : 1
            }).forEach(item => {

                item.customer = new CustomerModel(item.customer)
                item.state = new DemandStateModel(demandStateMap.get(item.state_id))

                let demandModel = new DemandModel(item)
                demandsMap.set(demandModel.id, demandModel)
            })

            return {}
        })
}

function fetchRows(){

    let rows = ''

    for(let [key, demandModel] of demandsMap){

        let today = dateformat(new Date(), 'ddmmyyyy') === dateformat(demandModel.date, 'ddmmyyyy'),
            dateStr = today ? `Сегодня ${dateformat(demandModel.date, 'HH:MM:ss')}` : dateformat(demandModel.date, 'dd.mm.yyyy HH:MM:ss')


        rows += `
            <tr data-demand-id="${demandModel.id}">
                <td class="rsdu-row-id" scope="col" align="right">${demandModel.id}</td>
                <td scope="col" align="right">${dateStr}</td>
                <td scope="col">${getConsumerCellData(demandModel)}</td>
                <td scope="col">${demandModel.description}</td>
                <td scope="col"><span class="badge ${demandModel.state.cls}">${demandModel.state.name}</span></td>
            </tr>        
        `
    }

    let table = `
    <table class="rsdu-call-table table table-responsive-sm table-striped table-hover table-bordered">
        <thead>
        <tr>
            <th scope="col">№</th>
            <th scope="col">Дата</th>
            <th scope="col">Потребитель</th>
            <th scope="col">Описание</th>
            <th scope="col">Статус</th>
        </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
    </table>
    ${getPagination()}  
    `

    $('#rsdu-table').append($(table))

    $('.rsdu-call-table tbody tr').on('click', function(el){

        let id = parseInt($(this).find('td.rsdu-row-id').html())

        id = isNaN(id) ? null : id

        showUpdateForm(demandsMap.get(id))
    })
}

function getPagination(){

    let pagination = '',
        pages = '',
        headTail = `
        <li class="page-item">
            <a class="page-link" href="#"><<</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="#"><</a>
        </li>
        <li class="page-item active">
            <a class="page-link" href="#">1</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="#">2</a>
        </li>
        <li class="page-item">
            <a class="page-link" href="#">></a>
        </li>
        <li class="page-item">
            <a class="page-link" href="#">>></a>
        </li>
    `



    pagination = `
        <ul class="pagination">
            ${pages}
        </ul>      
    `

    return pagination
}

function getConsumerCellData(demandModel){

    let strings = []

    if(demandModel.demandAddress) strings.push(demandModel.demandAddress)
    if(demandModel.customer.name) strings.push(demandModel.customer.name)
    if(demandModel.demandAddress) strings.push(`тел: ${demandModel.demandPhone}`)

    return strings.join('<br>')
}

/**
 * Смена статуса в форме
 */
function initStateSelect(){

    let jContainer = $('#rsdu-table-form-state-container')

    jContainer.find('a.dropdown-item').click(function(e){

        e.preventDefault()

        let stateId = parseInt($(this).attr('data-state-id'))

        if(isNaN(stateId)) return

        updateFormState(demandStateMap.get(stateId))
    })
}

function initSave(){

    let jModal = $('#rsdu-table-update-modal')

    jModal.find('.rsdu-modal-save').click(function(){

        let id = parseInt(jModal.find('#rsdu-table-form-id').val())

        if(isNaN(id)) return

        let demandModel = demandsMap.get(id)

        if(!demandModel) return

        let dt = jModal.find('#rsdu-table-form-date').val(),
            address = jModal.find('#rsdu-table-form-address').val(),
            customer = jModal.find('#rsdu-table-form-consumer').val(),
            phone = jModal.find('#rsdu-table-form-phone').val(),
            description = jModal.find('#rsdu-table-form-desc').val(),
            stateId = parseInt(jModal.find('#rsdu-table-form-state').attr('data-state')),
            stateModel = isNaN(stateId) ? null : demandStateMap.get(stateId),
            date = new Date(dt)

        demandModel.timestamp = +date
        demandModel.date = date
        demandModel.demandAddress = address
        demandModel.customer.name = customer
        demandModel.demandPhone = phone
        demandModel.description = description
        demandModel.state = stateModel

        updateTableRow(demandModel)
    })
}

function updateTableRow(demandModel){

    let row = $(`.rsdu-call-table tbody tr[data-demand-id="${demandModel.id}"]`),
        cols = $(row).find('td'),
        today = dateformat(new Date(), 'ddmmyyyy') === dateformat(demandModel.date, 'ddmmyyyy'),
        dateStr = today ? `Сегодня ${dateformat(demandModel.date, 'HH:MM:ss')}` : dateformat(demandModel.date, 'dd.mm.yyyy HH:MM:ss')

    $(cols[1]).html(dateStr)
    $(cols[2]).html(getConsumerCellData(demandModel))
    $(cols[3]).html(demandModel.description)
    $(cols[4]).html(`<span class="badge ${demandModel.state.cls}">${demandModel.state.name}</span>`)
}

function updateFormState(stateModel){

    let jInput = $('#rsdu-table-form-state')
    for(let [key, sm] of demandStateMap){
        jInput.removeClass(sm.cls)
    }

    jInput.addClass(stateModel.cls).val(stateModel.name).attr('data-state', stateModel.id)
}

function showUpdateForm(demandModel){

    let date = `${dateformat(demandModel.date, 'yyyy-mm-dd')}T${dateformat(demandModel.date, 'HH:MM')}`,
        jModal = $('#rsdu-table-update-modal')

    jModal.find('#rsdu-table-form-id').val(demandModel.id)
    jModal.find('#rsdu-table-form-date').val(date)
    jModal.find('#rsdu-table-form-address').val(demandModel.demandAddress)
    jModal.find('#rsdu-table-form-consumer').val(demandModel.customer.name)
    jModal.find('#rsdu-table-form-phone').val(demandModel.demandPhone)
    jModal.find('#rsdu-table-form-desc').val(demandModel.description)
    updateFormState(demandModel.state)

    jModal.modal('show');
}
