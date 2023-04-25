
'use strict';

let amqp = require('amqplib');
let Order = require('../service/OrderService');

module.exports.addTask = function(rabbitHost, queueName, order){
    amqp.connect('amqp://' + rabbitHost)
        .then(function(c) {
            c.createConfirmChannel()
                .then(function(channel) {
                    channel.assertQueue(queueName, {durable: true});
                    channel.sendToQueue(queueName, new Buffer.from(JSON.stringify(order)), {},
                        function(err, ok) {
                            let order_id = order._id;
                            let status;
                            if (err !== null){
                                console.warn(new Date(), 'Message is nacked!');
                                status = "failed";
                            }
                            else {
                                console.log(new Date(), 'Message is acked');
                                status = "inQueue";
                            }

                            Order.updateOrder(order_id, {status: status})
                                .then(function (response) {
                                    console.log("Update order", response);
                                }).catch(function (error) {
                                    console.log("failed", error);
                                });
                        });
                });
        }).catch((error) => {
            console.log(error,'Promise error');
        });
};
