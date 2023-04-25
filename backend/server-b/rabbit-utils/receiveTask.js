#!/usr/bin/env node
// Process tasks from the work queue
// in our case an order for a sandwich

'use strict';
var amqp = require('amqplib');

module.exports.getTask = function(rabbitHost, queueName, sendReply){
  amqp.connect('amqp://' + rabbitHost).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(channel) {
      var ok = channel.assertQueue(queueName, {durable: true});
      ok = ok.then(function() { channel.prefetch(1); });
      ok = ok.then(function() {
        channel.consume(queueName, doWork, {noAck: false});
      });
      return ok;

      function doWork(msg) {
        var body = msg.content.toString();
        console.log(" [x] Received '%s'", body);
        let order_info = JSON.parse(msg.content);
        order_info.status = "ready";
        console.log(order_info);
        setTimeout(function() {
          channel.ack(msg);
          sendReply(order_info);
        }, 5000);
      }
    });
  }).catch(console.warn);
}
