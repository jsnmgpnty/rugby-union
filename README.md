# Rugby Union

Engagement app for the Rugby Union event

# Description

This project uses nodejs with express and socket.io for realtime updates. The client app is built using React.js. The project also utilizes Docker for deployment and easier builds.

# Setup

To run locally without Docker, just issue the following commands:
```sh
$ npm install
$ npm run start
```
This would start the client application. You'll most likely see a connection issue at this time as the server is not yet running. To run the server, just issue this command:
```sh
$ npm run server
```
And voila! You should have a running Rugby Union app!

To run the app using Docker, make sure you have docker-cli installed. Next, run these following commands:
```sh
$ docker build -t rugby-union .
$ docker run -p <port>:8080 -e "REACT_APP_RUNTIME_PORT=<port>" rugby-union
```
Make sure that the ports you used match. The server will run at port 8080 and bound to the port you passed in the docker run command. The client will use the REACT_APP_RUNTIME_PORT environment which should connect to the server.