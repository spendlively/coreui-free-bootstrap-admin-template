import dateformat from 'dateformat'
import { ajax } from '../ajax/ajax'
import config from '../config/config'
import { outageListUrn, outageStateListUrn } from '../ajax/urn'
import {
    RSDU_DEMAND_CONSUMER,
    RSDU_DEMAND_DATE,
    RSDU_DEMAND_DESC,
    RSDU_DEMAND_N, RSDU_DEMAND_STATE,
    RSDU_NEW_DEMAND
} from '../l10n/lang/ruRu'
import DemandStateModel from '../model/DemandStateModel'
import DemandModel from '../model/DemandModel'
import CustomerModel from '../model/CustomerModel'
import { RSDU_SEARCH_PLACEHOLDER } from '../l10n/l10n'
import { sanitizeHTML } from '../sanitize/sanitize'
import { init as initCreate } from './create'
import { getOrder, getSortingArrow, isAllowed, setCurrentOrder } from './order'
import { init as initUpdate } from './update'

let demandStateMap = new Map(),
    demandsMap = new Map(),
    pageNum = 1,
    limit = 15,
    count = 0,
    lastSearch = ''

export function init() {

    initSearchField()

    fetchStates()
        .then(args => {
            fillStates()
            loadTable()
        })
}

export function loadTable() {

    fetchDemands()
        .then(args => {
            renderRows()
            initJqueryListeners()
        }, () => {
            //Продолжить загрузку в случае ошибки сервера
            renderRows()
            initJqueryListeners()
        })
}

function initJqueryListeners() {
    initPagination()
    initCreate()
    initUpdate()
}

function fillStates() {

    let jRsduDemandStates = $('.rsdu-demand-states')

    for (let [k, stateModel] of demandStateMap) {
        jRsduDemandStates.append($(`<a class="dropdown-item ${stateModel.cls}" data-state-id="${stateModel.id}" href="#">${stateModel.name}</a>`))
    }
}

function initSearchField() {

    let jRsduTableSearch = $('#rsdu-table-search')

    jRsduTableSearch.attr('placeholder', RSDU_SEARCH_PLACEHOLDER)

    jRsduTableSearch.keyup(function (event) {

        let searchStr = $(this)
            .val()
        if (!searchStr) {
            return
        }
        if (searchStr === lastSearch) {
            return
        }

        search(searchStr)
        lastSearch = searchStr
    })
}

function search(searchStr) {
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

    return ajax(`${config.serverUrl}${outageListUrn}?order=${getOrder()}&page=${pageNum}&limit=${limit}`)
        .then(json => {

            count = parseInt(json.count)
            count = isNaN(count) ? 0 : count

            json.items.forEach(item => {
                item.customer = new CustomerModel(item.customer || {})
                item.state = new DemandStateModel(demandStateMap.get(item.state_id))

                let demandModel = new DemandModel(item)
                demandsMap.set(demandModel.id, demandModel)
            })

            return {}
        })
        .catch(() => {
            console.log(arguments)
        })
}

function renderRows() {

    let rows = ''

    for (let [key, demandModel] of demandsMap) {

        let today = dateformat(new Date(), 'ddmmyyyy') === dateformat(demandModel.date, 'ddmmyyyy'),
            dateStr = today ? `Сегодня ${dateformat(demandModel.date, 'HH:MM:ss')}` : dateformat(demandModel.date, 'dd.mm.yyyy HH:MM:ss')

        rows += `
            <tr data-demand-id="${demandModel.id}">
                <td class="rsdu-row-id" scope="col" align="right">${demandModel.id}</td>
                <td scope="col" align="right">${dateStr}</td>
                <td scope="col">${sanitizeHTML(getConsumerCellData(demandModel))}</td>
                <td scope="col">${sanitizeHTML(demandModel.description)}</td>
                <td scope="col"><span class="badge ${demandModel.state.cls}">${demandModel.state.name}</span></td>
            </tr>        
        `
    }

    let table = `
    <table class="rsdu-call-table table table-responsive-sm table-striped table-hover table-bordered">
        <thead>
        <tr>
            <th scope="col">${RSDU_DEMAND_N}</th>
            <th scope="col" class="rsdu-cursor-pointer">${RSDU_DEMAND_DATE}${getSortingArrow('date')}</th>
            <th scope="col">${RSDU_DEMAND_CONSUMER}</th>
            <th scope="col">${RSDU_DEMAND_DESC}</th>
            <th scope="col" class="rsdu-cursor-pointer">${RSDU_DEMAND_STATE}${getSortingArrow('state')}</th>
        </tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
    </table>
    <button class="rsdu-new-demand btn btn-block btn-primary btn-lg" type="button">${RSDU_NEW_DEMAND}</button>
    ${getPagination()} 
    `

    $('#rsdu-table')
        .empty()
        .append($(table))

    $('.rsdu-call-table th.rsdu-cursor-pointer').click(function(){

        let jIcon = $(this).find('.rsdu-sort-column-icon'),
            column = jIcon.attr('data-sort-column'),
            direction = jIcon.attr('data-sort-direction'),
            newDirection = direction === 'down' ? 'up' : 'down'

        if(!isAllowed(column, newDirection)) return

        setCurrentOrder({
            column: column,
            direction: newDirection
        })

        demandsMap.clear()
        loadTable()
    })
}

function getPagination() {

    let lastPageNum = Math.ceil(count / limit),
        prevPageNum = pageNum - 1,
        nextPageNum = pageNum + 1,
        pagesIndent = 3,
        pagination = '',
        head = '',
        tail = ''

    if (lastPageNum === 1) {
        return ''
    }

    let startPageNum = pageNum - pagesIndent < 1 ? 1 : pageNum - pagesIndent,
        endPageNum = pageNum + pagesIndent > lastPageNum ? lastPageNum : pageNum + pagesIndent

    for (let n = startPageNum; n <= endPageNum; n++) {

        let pageNumHtml = n === pageNum ? `<strong>${n}</strong>` : n

        pagination += `
            <li class="page-item rsdu-demand-pagination" data-page-num="${n}">
                <a class="page-link" href="#">${pageNumHtml}</a>
            </li>
        `
    }

    if (pageNum > 1) {
        head = `
            <li class="page-item rsdu-demand-pagination" data-page-num="1">
                <a class="page-link" href="#"><<</a>
            </li>
            <li class="page-item rsdu-demand-pagination" data-page-num="${prevPageNum}">
                <a class="page-link" href="#"><</a>
            </li>
        `
    }

    if (pageNum < lastPageNum) {
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

function initPagination() {

    $('.rsdu-demand-pagination')
        .unbind('click')
        .click(function (e) {

            e.preventDefault()

            let dataPageNum = parseInt($(this)
                .attr('data-page-num'))

            if (isNaN(dataPageNum)) {
                throw new Error('Can\'n get page number')
            }

            pageNum = dataPageNum
            demandsMap.clear()
            loadTable()
        })
}

export function getConsumerCellData(demandModel) {

    let strings = []

    if (demandModel.demandAddress) {
        strings.push(sanitizeHTML(demandModel.demandAddress))
    }
    if (demandModel.customer.name) {
        strings.push(sanitizeHTML(demandModel.customer.name))
    }
    if (demandModel.demandPhone) {
        strings.push(sanitizeHTML(`тел: ${demandModel.demandPhone}`))
    }

    return strings.join('<br>')
}

export function getDemandStateMap() {
    return demandStateMap
}

export function getDemandMap() {
    return demandsMap
}
