const express = require('express')
// const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const DbManager = require('./db')

const port = process.env.PORT || 1337
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const db = new DbManager()

server.listen(port, () => {
  console.log('Server started. Listening at port %d', port)
})

io.on('connection', (socket) => {
  socket.on('new user', async ({ name, roomId, magnetURI }) => {
    socket.name = name
    try {
      if (roomId) {
        const roomData = await db.joinRoom(roomId)
        socket.roomId = roomId
        socket.magnetURI = roomData.magnetURI
      } else if (magnetURI) {
        socket.roomId = db.newRoom(magnetURI)
        socket.magnetURI = magnetURI
      } else {
        throw new Error('need one of either roomId or magnetURI.')
      }
    } catch (e) {
      console.error(e)
    }

    socket.join(socket.roomId, () => {
      console.log('new socket: ', socket.name, socket.roomId, socket.magnetURI)
      socket.to(socket.roomId).emit('new user', { name: socket.name })
      socket.emit('join room', {
        roomId: socket.roomId,
        magnetURI: socket.magnetURI,
      })
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

  socket.on('disconnect', () => {
    console.log('socket is disconnected: ', socket.name, socket.roomId)
    if (socket.roomId) {
      db.leaveRoom(socket.roomId)
    }
  })
})
