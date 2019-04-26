import $ from 'jquery'
import io from 'socket.io-client'

let socket = null

export function init(){

    $("#socketio-json").click((event)=>{
        console.log('DEBUG: click on socketio-json')
        event.preventDefault();
        json_button()
    })

    $("#socketio-alert").click((event)=>{
        console.log('DEBUG: click on socketio-alert')
        event.preventDefault();
        alert_button()
    })

    let address = 'http://' + window.location.host + ':80'
    // let address = 'http://' + '192.168.20.107' + ':8888'

    socket = io(address)
    window.rsdu_socket = socket

    console.log(address)
    console.log(socket)

    socket.on('connect', () => {
        console.log('DEBUG: on connect!')
        socket.emit('client_connected', {data: 'OMS client connected!'});
    });

    socket.on('message', function (data) {
        console.log('DEBUG: on message')
        console.log('Message form backend: ' + JSON.stringify(data));
        alert('Message form backend: ' + JSON.stringify(data));
    });

    socket.on('alert', function (data) {
        console.log('DEBUG: on alert')
        console.log('Alert Message: ' + JSON.stringify(data));
        alert(data);
    });
}

function json_button() {
    console.log("DEBUG: json_button()")
    socket.send('{"message": "test from OMS"}');
}

function alert_button() {
    console.log("DEBUG: alert_button()")
    socket.emit('alert_button', 'Message from OMS!')
}
