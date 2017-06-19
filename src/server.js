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
  console.log('socket connected')
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
      console.log(`${socket.name}'s' socket is in room: ${socket.roomId}`)
      socket.to(socket.roomId).emit('new user', { name: socket.name })
      const mockMagnetURI = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
      socket.emit('join room', {
        roomId: socket.roomId,
        magnetURI: mockMagnetURI,
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
})
