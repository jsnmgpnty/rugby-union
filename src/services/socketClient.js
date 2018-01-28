import openSocket from 'socket.io-client';

// initialize connection to socket server
// move this uri to a config
const socket = openSocket('http://localhost:58784');

function ping(callback) {
  socket.on('myEvent', (message) => {
    callback(message);
  });

  socket.on('connected', (data) => {
    console.log(data);
  });

  // emit an event to server
  setTimeout(() => socket.emit('myEvent', {}), 1000);
}

export { ping };