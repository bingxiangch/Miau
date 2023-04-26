# Server A
This directory is for the code and documentation of the server A. A starter Dockerfile has been added, it has some comments to get you started.
For communicating with RabbitMQ, there are many possible approaches. In the rabbit-utils-directory, in receiveTask.js and sendTask.js files, you can see simple examples of code that can be integrated into Swagger server stub's Order-controller. These have been directly copied from RabbitMQ examples and can be improved a lot for this system.
### Running the server
How to run
```
npm start
```

Swagger interface:

```
http://localhost:8080/docs
```
