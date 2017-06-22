const express = require('express')
// const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const sqlite3 = require('sqlite3').verbose()
const shortid = require('shortid')

const port = process.env.PORT || 1337
const app = express()
const server = http.createServer(app)
const io = socketio(server)

server.listen(port, () => {
  console.log('Server started. Listening at port %d', port)
})

const db = new sqlite3.Database('lobster.db', () => {
  db.run('CREATE TABLE if not exists rooms (roomId TEXT, magnetURI TEXT, userNum INTEGER)')
})

const getRoomData = (roomId) => {
  const roomData = new Promise((resolve, reject) => {
    db.get('SELECT * FROM rooms where roomId = ?', roomId,
      (err, row) => {
        if (!err && row) {
          resolve(row)
        } else {
          console.trace("error here!")
          reject(err || 'no result')
        }
      })
  })
  return roomData
}

const newRoom = (magnetURI) => {
  const newRoomId = shortid.generate()
  db.run('INSERT INTO rooms VALUES (?, ?, 1)', [newRoomId, magnetURI], () => {
    db.all('SELECT * FROM rooms', (err, rows) => console.log(rows))
  })
  return newRoomId
}

const updateRoomUserNum = async (roomId, userNumDelta) => {
  const roomData = await getRoomData(roomId)
  roomData.userNum += userNumDelta
  if (roomData.userNum > 0) {
    db.run('UPDATE rooms SET userNum = ? WHERE roomId = ?', [roomData.userNum, roomData.roomId])
  } else {
    db.run('DELETE FROM rooms WHERE roomId = ?', roomData.roomId)
  }
  return roomData
}

const joinRoom = roomId => updateRoomUserNum(roomId, 1)
const leaveRoom = roomId => updateRoomUserNum(roomId, -1)

io.on('connection', (socket) => {
  console.log('socket connected')

  socket.on('new user', async ({ name, roomId, magnetURI }) => {
    console.log('param', name, roomId, magnetURI)
    socket.name = name
    try {
      if (roomId) {
        const roomData = await joinRoom(roomId)
        console.log('joined room: ', roomData)
        socket.roomId = roomId
        socket.magnetURI = roomData.magnetURI
      } else if (magnetURI) {
        socket.roomId = newRoom(magnetURI)
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
    leaveRoom(socket.roomId)
  })
})
