'use strict';
let fs = require('fs'),
    path = require('path'),
    http = require('http');
let app = require('connect')();
let swaggerTools = require('swagger-tools');
let jsyaml = require('js-yaml');
let cors = require('cors');
let serverPort = 8080;
let utils = require('./utils/writer.js');
require('./db/db.js')();

// rabbitMq config
var receiveTask = require('./rabbit-utils/receiveTask.js');
var rabbitmqHost = "rapid-runner-rabbit:5672";
var orderReadyQueue = "ready-queue";

// swaggerRouter configuration
let options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

let spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
let swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  app.use(cors());
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter(options));
  app.use(middleware.swaggerUi());

  // run server-a
  http.createServer(app).listen(serverPort, function () {
  });
});

const updateStatus = function(msgBody) {
  var orderId = JSON.parse(msgBody)._id;
  console.log(orderId);
};
receiveTask.getTask(rabbitmqHost, orderReadyQueue, updateStatus);
