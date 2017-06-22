const sqlite3 = require('sqlite3').verbose()
const shortid = require('shortid')

module.exports = class DbManager {

  constructor() {
    this.db = new sqlite3.Database('lobster.db', () => {
      this.db.run('CREATE TABLE if not exists rooms (roomId TEXT, magnetURI TEXT, userNum INTEGER)')
    })
  }

  getRoomData(roomId) {
    const roomData = new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM rooms where roomId = ?', roomId,
        (err, row) => {
          if (!err && row) {
            resolve(row)
          } else {
            reject(err || 'no result')
          }
        })
    })
    return roomData
  }

  newRoom(magnetURI) {
    const newRoomId = shortid.generate()
    this.db.run('INSERT INTO rooms VALUES (?, ?, 1)', [newRoomId, magnetURI])
    return newRoomId
  }

  async updateRoomUserNum(roomId, userNumDelta) {
    const roomData = await this.getRoomData(roomId)
    console.log('roomData', roomData)
    roomData.userNum += userNumDelta
    if (roomData.userNum > 0) {
      this.db.run('UPDATE rooms SET userNum = ? WHERE roomId = ?', [roomData.userNum, roomData.roomId])
    } else {
      this.db.run('DELETE FROM rooms WHERE roomId = ?', roomData.roomId)
    }
    return roomData
  }

  joinRoom(roomId) {
    return this.updateRoomUserNum(roomId, 1)
  }

  leaveRoom(roomId) {
    console.log('leave room')
    return this.updateRoomUserNum(roomId, -1)
  }

}
