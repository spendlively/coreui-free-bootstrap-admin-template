import config from '../config/config'

let socket = null

//Флаг для определения было ли соединение уже установлено,
//чтобы не обрабатывать установку соединения каждую интеацию
let connected = false

function getSocket() {

    if (socket === null) {
        socket = new WebSocket('ws://localhost:' + config.webSocketServerPort)
        socket.onmessage = function (event) {

            let data = JSON.parse(event.data)

            if (!data.items.length) return

            data.items.forEach((item) => {
                appendMessage(item)
            })
        }
    }

    return socket;
}

function deleteSocket() {
    socket = null
    connected = false
}

function connect() {
    setTimeout(() => {

        let ws = getSocket()

        //States: CONNECTING (0), OPEN (1), CLOSING (2), CLOSED (3)
        switch (ws.readyState) {
            //Если статус CONNECTING, вызываем connect(...arguments) повторно
            case ws.CONNECTING:
                console.log('WS: WebSocket status is "CONNECTING", waiting for connection...')
                connect()
                break
            //Если статус OPEN и соединение еще не установлено (connected = false),
            //отправляем console.log об установке соединения и устанавливаем флаг connected = true
            case ws.OPEN:
                if (!connected) {
                    console.log('WS: WebSocket status is "OPEN", connection established.')
                    connected = true
                }
                connect()
                break
            //Если статус CLOSING, вызываем connect(...arguments) повторно
            case ws.CLOSING:
                console.log('WS: WebSocket status is "CLOSING", waiting for reconnection...')
                connect()
                break
            //Если статус CLOSED, удаляем существуюший сокет и вызываем connect(...arguments) повторно
            case ws.CLOSED:
                console.log('WS: WebSocket status is "CLOSED", trying to reconnect...')
                deleteSocket()
                connect()
                break
            default:
        }

    }, 2000)
}

export function init() {

    connect()
}

function appendMessage(message) {

    let date = message.timestamp ? new Date(+message.timestamp * 1000) : null,
        formattedDate = message.timestamp ? date.toLocaleTimeString() : '',
        action = message.action || '',
        subject = message.subject || '',
        place = message.place || '',
        status = message.status || 'green',
        cls = status === 'green' ? 'list-group-item-accent-success' : 'list-group-item-accent-danger'

    // console.log(message.timestamp)
    // console.log(+message.timestamp * 1000)
    // console.log(date)
    // console.log(formattedDate)
    // console.log('=========================================')

    let html = $(`
        <div class="list-group-item ${cls} list-group-item-divider">
            <div>
                ${action}
                <strong>${subject}</strong>
            </div>
            <small class="text-muted mr-3">
                <i class="icon-calendar"></i>&nbsp; ${formattedDate}
            </small>
            <small class="text-muted">
                <i class="icon-location-pin"></i>&nbsp; ${place}
            </small>
        </div>
    `)

    $('#rsdu-messages').append(html)
}
