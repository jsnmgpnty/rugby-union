import uuid from 'uuid';
import { local, prod } from './SocketEnv';
import EventPubSub from './EventPubSub';
const eventPubSub = new EventPubSub();

// initialize connection to socket server
const socketUrl = window.appConfig.env === 'prod' ? prod.url : local.url;
let webSocket = new WebSocket(socketUrl);

webSocket.onopen = function (event) {
  console.log("opened connection to " + socketUrl);
};

webSocket.onclose = function (event) {
  console.log("closed connection from " + socketUrl);
  setTimeout(function () {
    console.log("websocket client is reconnecting...");
    webSocket = new WebSocket(socketUrl);
  }, 500);
};

webSocket.onmessage = function (event) {
  try {
    var data = JSON.parse(event.data);
    eventPubSub.emit(data.topic, data.payload, false);
  } catch (error) {
    console.log(error);
  }
};

webSocket.onerror = function (event) {
  console.log("error: " + event.data);
};

function onGameCreated(callback) {
  eventPubSub.on('game:created', (message) => {
    console.log(`game:created ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameJoined(callback) {
  eventPubSub.on('game:joined', (message) => {
    console.log(`game:join ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameLeft(callback) {
  eventPubSub.on('game:leave', (message) => {
    console.log(`game:leave ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameStarted(callback) {
  eventPubSub.on('game:started', (message) => {
    console.log(`game:started ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameFinalScoreboard(callback) {
  eventPubSub.on('game:result:scoreboard:finished', (message) => {
    console.log(`game:result:scoreboard:finished ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameFinalResult(callback) {
  eventPubSub.on('game:result:team:finished', (message) => {
    console.log(`game:result:team:finished ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameScoreboard(callback) {
  eventPubSub.on('game:result:scoreboard:turn', (message) => {
    console.log(`game:result:scoreboard:turn ${JSON.stringify(message)}`);
    callback(message);
  });
}

function onGameResult(callback) {
  eventPubSub.on('game:result:team:turn', (message) => {
    console.log(`game:result:team:turn ${JSON.stringify(message)}`);
    callback(message);
  });
}

export {
  onGameJoined,
  onGameCreated,
  onGameStarted,
  onGameLeft,
  onGameFinalScoreboard,
  onGameFinalResult,
  onGameScoreboard,
  onGameResult,
};
