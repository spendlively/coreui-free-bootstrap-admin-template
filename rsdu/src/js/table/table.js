import dateformat from "dateformat";

export function init(){

    initStateSelect()
    initSave()
    fetchRows()
}

let editingRowNum = null

const STATES = {
    green: {
        cls: 'badge-success',
        text: 'Направлена бригада'
    },
    red: {
        cls: 'badge-danger',
        text: 'Banned'
    },
    yellow: {
        cls: 'badge-warning',
        text: 'Pending'
    },
    blue: {
        cls: 'badge-info',
        text: 'Завершено'
    },
}

let data = [
    {
        id: 1,
        timestamp: 1559817951540,
        address: 'с. Лутавенка, ул. Иванова 10',
        consumer: 'Петров С.И.',
        phone: '+7903903903',
        description: 'Отсутствует электричество',
        state: 'green'
    },
    {
        id: 2,
        timestamp: 1559817951540,
        address: 'с. Лутавенка, ул. Иванова 10',
        consumer: 'Петров С.И.',
        phone: '+7903903903',
        description: 'Моргает лампочка',
        state: 'red'
    },
    {
        id: 3,
        timestamp: 1559817951540,
        address: 'с. Лутавенка, ул. Иванова 10',
        consumer: 'Петров С.И.',
        phone: '+7903903903',
        description: 'Моргает лампочка',
        state: 'yellow'
    },
    {
        id: 4,
        timestamp: 1559817951540,
        address: 'с. Лутавенка, ул. Иванова 10',
        consumer: 'Петров С.И.',
        phone: '+7903903903',
        description: 'Моргает лампочка',
        state: 'blue'
    }
]

/**
cls: "badge " + STATES.green.cls,
text:  STATES.green.text
 */
function fetchRows(){

    let rows = ''

    data.forEach((d) => {

        let date = new Date(d.timestamp),
            today = dateformat(new Date(), 'ddmmyyyy') === dateformat(date, 'ddmmyyyy'),
            dateStr = today ? `Сегодня ${dateformat(date, 'HH:MM:ss')}` : dateformat(date, 'dd.mm.yyyy HH:MM:ss'),
            phoneStr = d.phone ? `тел: ${d.phone}` : ''

        rows += `
            <tr>
                <td class="rsdu-row-id display-none" scope="col">${d.id}</td>
                <td scope="col" align="right">${dateStr}</td>
                <td scope="col">${d.address} ${d.consumer} ${phoneStr}</td>
                <td scope="col">${d.description}</td>
                <td scope="col"><span class="badge ${STATES[d.state].cls}">${STATES[d.state].text}</span></td>
            </tr>        
        `
    })

    let table = `
    <table class="rsdu-call-table table table-responsive-sm table-striped table-hover table-bordered">
        <thead>
        <tr>
            <th class="display-none" scope="col">ID</th>
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
    <ul class="pagination">
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
    </ul>  
    `

    $('#rsdu-table').append($(table))

    $('.rsdu-call-table tbody tr').on('click', function(el){

        let id = parseInt($(this).find('td.rsdu-row-id').html())

        editingRowNum = isNaN(id) ? null : id

        if(editingRowNum) showUpdateForm(data[editingRowNum-1])
    })
}

function initStateSelect(){

    let jContainer = $('#rsdu-table-form-state-container')

    jContainer.find('a.dropdown-item').click(function(){
        let stateAlias = $(this).attr('data-state-alias')
        if(STATES[stateAlias] === undefined) return
        updateFormState(stateAlias)
    })
}

function initSave(){

    let jModal = $('#rsdu-table-update-modal')

    jModal.find('.rsdu-modal-save').click(function(){

        let dt = jModal.find('#rsdu-table-form-date').val(),
            address = jModal.find('#rsdu-table-form-address').val(),
            consumer = jModal.find('#rsdu-table-form-consumer').val(),
            phone = jModal.find('#rsdu-table-form-phone').val(),
            description = jModal.find('#rsdu-table-form-desc').val(),
            stateAlias = jModal.find('#rsdu-table-form-state').attr('data-state')

        let id = editingRowNum - 1,
            rows = $('.rsdu-call-table tbody tr'),
            cols = $(rows[id]).find('td'),
            phoneStr = phone ? `тел: ${phone}` : '',
            date = new Date(dt),
            today = dateformat(new Date(), 'ddmmyyyy') === dateformat(date, 'ddmmyyyy'),
            dateStr = today ? `Сегодня ${dateformat(date, 'HH:MM:ss')}` : dateformat(date, 'dd.mm.yyyy HH:MM:ss')

        data[id].timestamp = +date
        data[id].address = address
        data[id].consumer = consumer
        data[id].phone = phone
        data[id].description = description
        data[id].state = stateAlias

        $(cols[1]).html(dateStr)
        $(cols[2]).html(`${address} ${consumer} ${phoneStr}`)
        $(cols[3]).html(description)
        $(cols[4]).html(`<span class="badge ${STATES[stateAlias].cls}">${STATES[stateAlias].text}</span>`)
    })
}

function updateFormState(stateAlias){

    let jInput = $('#rsdu-table-form-state')
    for(let col in STATES){
        if(!STATES.hasOwnProperty(col)) continue
        jInput.removeClass(STATES[col].cls)
    }

    jInput.addClass(STATES[stateAlias].cls).val(STATES[stateAlias].text).attr('data-state', stateAlias)
}

function showUpdateForm(data){

    let now = new Date(data.timestamp),
        date = `${dateformat(now, 'yyyy-mm-dd')}T${dateformat(now, 'HH:MM')}`,
        jModal = $('#rsdu-table-update-modal')

    jModal.find('#rsdu-table-form-date').val(date)
    jModal.find('#rsdu-table-form-address').val(data.address)
    jModal.find('#rsdu-table-form-consumer').val(data.consumer)
    jModal.find('#rsdu-table-form-phone').val(data.phone)
    jModal.find('#rsdu-table-form-desc').val(data.description)
    updateFormState(data.state)

    jModal.modal('show');
}
