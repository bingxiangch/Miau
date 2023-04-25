let sendTask = require('../rabbit-utils/sendTask');
let rabbitmqHost = "rapid-runner-rabbit:5672";
let queueOfOrder = "order-queue";

let Order = require('../service/OrderService');

exports.getInitOrder = function() {

    Order.getOrderByStatus("received").then((received_orders) => {
        console.log(received_orders);
        for(let i = 0; i < received_orders.length; i++) {
            let obj = received_orders[i];
            sendTask.addTask(rabbitmqHost, queueOfOrder, obj);
        }
    });

};
