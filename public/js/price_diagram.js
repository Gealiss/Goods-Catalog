function drawChart(input) {
    var ctx = document.getElementById('ModalPriceGraph').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                fill: false,
                label: 'Price',
                borderColor: 'rgba(90, 148, 90, 1)',
                backgroundColor: 'rgba(90, 148, 90, 1)',
                data: input, //DATA
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
			title: {
                display: true,
                text: 'Price changes'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    },
                    ticks: {
                        major: {
                            fontStyle: 'bold',
                            fontColor: '#FF0000'
                        }
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'BYN'
                    }
                }]
            }
        }
    });
    return myChart;
}

function removeData(myChart){
    myChart.data.labels.pop();
    myChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    myChart.update();
}

function addData(myChart, item_price_history, interval) {

    if(!interval){
        interval = {
            number: 1,
            measure: 'years'
        };
    }

    let data = [];

    item_price_history.forEach((element) => {
        data.push({x: moment(element.date).format('YYYY-MM-DDTHH:mm'), y: element.price});
    });

    myChart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    myChart.update();
}