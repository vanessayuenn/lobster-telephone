const express = require('express')
// const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const port = process.env.PORT || 1337
const app = express()
const server = http.createServer(app)
const io = socketio(server)

server.listen(port, () => {
  console.log('Server listening at port %d', port)
})


io.on('connection', (socket) => {
  socket.on('new user', ({ name, roomId }) => {
    socket.name = name
    console.log('param', name, roomId)
    if (roomId && !socket.roomId) {
      socket.roomId = roomId
    } else {
      // TODO: generate roomId
      socket.roomId = 'room1'
    }
    socket.join(socket.roomId, () => {
      console.log('socket is in room: ', socket.roomId)
      socket.to(socket.roomId).emit('new user', { name: socket.name })
      socket.emit('join room', { roomId: socket.roomId })
    })
  })

  socket.on('play', ({ time }) => {
    io.in(socket.roomId).emit('play', { name: socket.name, time })
  })

  socket.on('pause', () => {
    io.in(socket.roomId).emit('pause', {
      name: socket.name,
    })
  })
})
