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
    console.log(`game:created ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameJoin(message) {
  socket.emit('game:join', message);
}

function onGameJoined(callback) {
  socket.on('game:joined', (message) => {
    console.log(`game:join ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameLeave(message) {
  socket.emit('game:leave', message);
}

function onGameLeft(callback) {
  socket.on('game:leave', (message) => {
    console.log(`game:leave ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameStart(message) {
  socket.emit('game:start', message);
}

function onGameStarted(callback) {
  socket.on('game:started', (message) => {
    console.log(`game:started ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onUserCreate(username, isReturningUser = true) {
  const user = {
    username,
    userId : uuid(),
    isReturningUser,
  };
  socket.emit('user:create', user);
}

function onUserCreated(callback) {
  socket.on('user:created', (message) => {
    console.log(`user:created ${JSON.stringify(message)}`);
    callback(message);
  });
}

export {
  ping,
  onGameJoin,
  onGameJoined,
  onGameCreate,
  onGameCreated,
  onGameStart,
  onGameStarted,
  onGameLeave,
  onGameLeft,
  onUserCreate,
  onUserCreated,
};
