var sendTask = require('./rabbit-utils/sendTask');
var receiveTask = require('./rabbit-utils/receiveTask');
var orderQueueName = "order-queue";
var orderReadyQueue = "ready-queue";
var rabbitmqHost = "rapid-runner-rabbit:5672";


console.log("Run server-b ");

const sendReply = function(msgBody) {
  console.log(" msgBody'%s'", msgBody);

  sendTask.addTask(rabbitmqHost, orderReadyQueue, msgBody);
};

// listen to order queue
console.log("push new message to ready queue");
receiveTask.getTask(rabbitmqHost, orderQueueName, sendReply);
