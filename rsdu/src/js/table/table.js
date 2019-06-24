import dateformat from "dateformat";
import {ajax} from "../ajax/ajax";
import config from "../config/config";
import {outageListUrn, outageStateListUrn} from "../ajax/urn";
import {
    RSDU_DEMAND_CONSUMER,
    RSDU_DEMAND_DATE,
    RSDU_DEMAND_DESC,
    RSDU_DEMAND_N, RSDU_DEMAND_STATE,
    RSDU_NEW_DEMAND
} from '../l10n/lang/ruRu'
import DemandStateModel from "../model/DemandStateModel";
import DemandModel from "../model/DemandModel";
import CustomerModel from "../model/CustomerModel";
import {RSDU_SEARCH_PLACEHOLDER} from "../l10n/l10n";

let demandStateMap = new Map(),
    demandsMap = new Map(),
    order = 'timestamp-desc',
    pageNum = 1,
    limit = 15,
    count = 0,
    lastSearch = ''

export function init(){

    initSearchField()

    fetchStates()
        .then(args => {
            loadTable()
        })
}

function loadTable(){

    fetchDemands()
        .then(args => {
            renderRows()
            initJqueryListeners()
        })
}

function initJqueryListeners(){
    initStateSelect()
    initSave()
    initClickOnRow()
    initPagination()
    initNewDemand()
}

function initSearchField(){

    let jRsduTableSearch = $('#rsdu-table-search')

    jRsduTableSearch.attr('placeholder', RSDU_SEARCH_PLACEHOLDER)

    jRsduTableSearch.keyup(function (event) {

        let searchStr = $(this).val()

        if (!searchStr) {
            return
        }

        //Чтобы не отправлять повторно один запрос
        //и выпадающее меню не "моргало" при нажатии на стрелочки
        if (searchStr === lastSearch) {
            return
        }

        search(searchStr)
        lastSearch = searchStr
    })
}

function search(searchStr){
    console.log(searchStr)
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

    return ajax(`${config.serverUrl}${outageListUrn}?order=${order}&page=${pageNum}&limit=${limit}`)
        .then(json => {

            count = parseInt(json.count)
            count = isNaN(count) ? 0 : count

            json.items.forEach(item => {

                item.customer = new CustomerModel(item.customer)
                item.state = new DemandStateModel(demandStateMap.get(item.state_id))

                let demandModel = new DemandModel(item)
                demandsMap.set(demandModel.id, demandModel)
            })

            return {}
        })
}

function renderRows(){

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
            <th scope="col">${RSDU_DEMAND_N}</th>
            <th scope="col">${RSDU_DEMAND_DATE}</th>
            <th scope="col">${RSDU_DEMAND_CONSUMER}</th>
            <th scope="col">${RSDU_DEMAND_DESC}</th>
            <th scope="col">${RSDU_DEMAND_STATE}</th>
        </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
    </table>
    <button class="rsdu-new-demand btn btn-block btn-primary" type="button">${RSDU_NEW_DEMAND}</button>
    ${getPagination()} 
    `

    $('#rsdu-table').empty().append($(table))
}

function initClickOnRow(){

    $('.rsdu-call-table tbody tr').on('click', function(el){

        let id = parseInt($(this).find('td.rsdu-row-id').html())

        if(!isNaN(id)){
            showUpdateForm(demandsMap.get(id))
        }
    })
}

function getPagination(){

    let lastPageNum = Math.ceil(count/limit),
        prevPageNum = pageNum - 1,
        nextPageNum = pageNum + 1,
        pagesIndent = 3,
        pagination = '',
        head = '',
        tail = ''

    if (lastPageNum === 1) return ''

    let startPageNum = pageNum - pagesIndent < 1 ? 1 : pageNum - pagesIndent,
        endPageNum = pageNum + pagesIndent > lastPageNum ? lastPageNum : pageNum + pagesIndent

    for(let n = startPageNum; n <= endPageNum; n++){

        let pageNumHtml = n === pageNum ? `<strong>${n}</strong>` : n

        pagination += `
            <li class="page-item rsdu-demand-pagination" data-page-num="${n}">
                <a class="page-link" href="#">${pageNumHtml}</a>
            </li>
        `
    }

    if(pageNum > 1){
        head = `
            <li class="page-item rsdu-demand-pagination" data-page-num="1">
                <a class="page-link" href="#"><<</a>
            </li>
            <li class="page-item rsdu-demand-pagination" data-page-num="${prevPageNum}">
                <a class="page-link" href="#"><</a>
            </li>
        `
    }

    if(pageNum < lastPageNum){
        tail = `
            <li class="page-item rsdu-demand-pagination" data-page-num="${nextPageNum}">
                <a class="page-link" href="#">></a>
            </li>
            <li class="page-item rsdu-demand-pagination" data-page-num="${lastPageNum}">
                <a class="page-link" href="#">>></a>
            </li>
        `
    }

    return `
        <ul class="rsdu-table-pagination pagination">
            ${head}
            ${pagination}
            ${tail}
        </ul>      
    `
}

function initNewDemand(){

    $('.rsdu-new-demand').click(function(e){
        e.preventDefault()
        showCreateForm()
    })
}

function initPagination(){

    $('.rsdu-demand-pagination').click(function(e){

        e.preventDefault()

        let dataPageNum = parseInt($(this).attr('data-page-num'))

        if(isNaN(dataPageNum)) throw new Error("Can'n get page number")

        pageNum = dataPageNum
        demandsMap.clear()
        loadTable()
    })
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

        ajax(`${config.serverUrl}/rsdu/oms/api/outage/demand/update/${demandModel.id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "customer_id": demandModel.customer.id,
                "description": demandModel.description,
                "state_id": demandModel.state.id
            })
        })
        .then(json => {
            console.log(json)
            if(json.status === "Ok"){
                updateTableRow(demandModel)
            } else if (json.status === "Error"){
                showErrorModal(json.message)
            }
        })
    })
}

function showErrorModal(message){

    let modal = $('#loginErrorModal'),
      modalBody = modal.find('.modal-body')

    modalBody.html(message)
    modal.modal('show');

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

function showCreateForm(){

    let now = new Date(),
        date = `${dateformat(now, 'yyyy-mm-dd')}T${dateformat(now, 'HH:MM')}`,
      jModal = $('#rsdu-table-update-modal')

    jModal.find('#rsdu-table-form-id').val('')
    jModal.find('#rsdu-table-form-date').val(date)
    jModal.find('#rsdu-table-form-address').val('')
    jModal.find('#rsdu-table-form-consumer').val('')
    jModal.find('#rsdu-table-form-phone').val('')
    jModal.find('#rsdu-table-form-desc').val('')
    updateFormState('')

    jModal.modal('show');
}
