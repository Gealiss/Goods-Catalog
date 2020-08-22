var host = location.origin.replace(/^http/, 'ws')
var socket = new WebSocket(host);

socket.onopen = function() {
    console.log("Соединение установлено.");
};

socket.onmessage = function(event) {
    console.log("Получены данные " + event.data);
    let data = JSON.parse(event.data);
    
    //IF PRICE HISTORY OF LAST OPENED ITEM HAS BEEN UPDATED
    if(temp_item._id == data.item_id){
        removeData(myChart);
        addData(myChart, data.price_history);
    }
};