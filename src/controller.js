const socketio = require('socket.io-client')

let socket

function joinRoom(name, roomId) {
  socket.emit('new user', { name, roomId })
}

function connect() {
  socket = socketio('http://localhost:1337')
  return socket
}

module.exports = {
  joinRoom,
  connect,
}
