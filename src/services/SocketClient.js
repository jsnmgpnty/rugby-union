import uuid from 'uuid';
import { local, prod } from './SocketEnv';
import openSocket from 'socket.io-client';	
  		  
// initialize connection to socket server
 const socketUrl = window.appConfig.env === 'prod' ? prod.url : local.url;
 const socket = openSocket(socketUrl);	

 function initializeSession(data) {
   socket.emit('user:session', data);
 }

 function onGameJoin(message) {
   socket.emit('game:join', message);
 }

function onGameCreated(callback) {
  socket.on('game:created', (message) => {
    console.log(`game:created ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameJoined(callback) {
  socket.on('game:joined', (message) => {
    console.log(`game:joined ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameLeft(callback) {
  socket.on('game:leave', (message) => {
    console.log(`game:leave ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameStarted(callback) {
  socket.on('game:started', (message) => {
    console.log(`game:started ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameFinalScoreboard(callback) {
  socket.on('game:result:scoreboard:finished', (message) => {
    console.log(`game:result:scoreboard:finished ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameFinalResult(callback) {
  socket.on('game:result:team:finished', (message) => {
    console.log(`game:result:team:finished ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameScoreboard(callback) {
  socket.on('game:result:scoreboard:turn', (message) => {
    console.log(`game:result:scoreboard:turn ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameResult(callback) {
  socket.on('game:result:team:turn', (message) => {
    console.log(`game:result:team:turn ${JSON.stringify(message)}`);
    callback(message);
  });
}

export {
  initializeSession,
  onGameJoin,
  onGameJoined,
  onGameCreated,
  onGameStarted,
  onGameLeft,
  onGameFinalScoreboard,
  onGameFinalResult,
  onGameScoreboard,
  onGameResult,
};
