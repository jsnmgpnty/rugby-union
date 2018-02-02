import uuid from 'uuid';
import openSocket from 'socket.io-client';

// initialize connection to socket server
const socket = openSocket(window.appConfig.socketServerUrl);

socket.on('connected', (data) => {
  console.log(data);
});

function ping(callback) {
  socket.on('myEvent', (message) => {
    callback(message);
  });

  // emit an event to server
  setTimeout(() => socket.emit('myEvent', {}), 1000);
}

function onGameCreate(message) {
  socket.emit('game:create', message);
}

function onGameCreated(callback) {
  socket.on('game:created', (message) => {
    callback(message);
  });
}

function onGameJoined(callback) {
  socket.on('game:joined', (message) => {
    callback(message);
  });
}

function onGameJoin(message) {
  socket.emit('game:join', message);
}

function onUserCreate(username) {
  const user = {
    name : username,
    userid : uuid(),
  }
  socket.emit('user:create', user);
}

export {
  ping,
  onGameJoin,
  onGameJoined,
  onUserCreate,
};