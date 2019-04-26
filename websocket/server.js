let WebSocketServer = new require('ws');
let fs = require('fs');

//подключенные клиенты
let clients = {};

//порт
let webSocketServer = new WebSocketServer.Server({
    port: 8888
});

let cont = fs.readFileSync('data.json');
let data = decodeURIComponent(cont);

webSocketServer.on('connection', function(ws) {

    let id = Math.random();
    clients[id] = ws;

    // while(ws.readyState !== ws.OPEN){}
    ws.send(data);
    console.log('send data to ' + id)

    // ws.on('message', function(message) {
    //     console.log('получено сообщение ' + message);
    //     for (let key in clients) {
    //         clients[key].send(data);
    //     }
    // });

    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });

});
