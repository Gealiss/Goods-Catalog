const WebSocket = require('ws');

//DB EVENT EMITTER
const emitter = require('../db')().Emitter;
let eventName = "priceChange";

module.exports = async (server) => {
    //WEBSOCKET
    const wss = new WebSocket.Server({server: server});

    wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    emitter.on(eventName, (data) => {
        let obj = {};
        let price_history = [];
        data.price_history.forEach(elem => {
        price_history.push({date: elem.date, price: elem.price});
        });
        obj.item_id = data.item_id;
        obj.price_history = price_history;
        ws.send(JSON.stringify(obj));
    });
    //ws.send('something');
    });
}