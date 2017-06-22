import SocketClient from 'socket.io-client'
import WebTorrent from 'webtorrent'
import { ipcRenderer } from 'electron'

const socketURI = 'http://localhost:1337'


export default class Controller {

  constructor() {
    this.socket = new SocketClient(socketURI)
    this.wtClient = new WebTorrent()
    this.magnetURI = ''
    this.videoElem = null

    this.socket.on('play', this.socketOnPlay.bind(this))
    this.socket.on('pause', this.socketOnPause.bind(this))
    this.socket.on('join room', this.socketOnJoinRoom.bind(this))
  }

  videoRender(videoId, magnetURI) {
    this.wtClient.add(magnetURI, (torrent) => {
      // Got torrent me tadata!
      console.log('Client is downloading:', torrent.infoHash, torrent.files)
      const videoFile = torrent.files.find(file => this.isVideo(file.name))
      videoFile.renderTo(`video#${videoId}`, { autoplay: false }, (err, elem) => {
        if (err) {
          console.error(`rendering error: ${err}`)
        }
        this.videoElem = elem
        ipcRenderer.send(
          'videoRendered',
          { videoWidth: elem.videoWidth, videoHeight: elem.videoHeight }
        )
      })
    })
  }

  videoPlayPause(action) {
    if (action === 'play') {
      this.socket.emit('play', { time: this.videoElem.currentTime })
    } else {
      this.socket.emit('pause')
    }
  }


  socketJoinRoom(name, roomId, magnetURI) {
    console.log('socketJoinRoom', name, roomId, magnetURI)
    this.socket.emit('new user', { name, roomId, magnetURI })
  }

  socketOnJoinRoom(payload) {
    console.warn(this)
    this.magnetURI = payload.magnetURI
    this.videoRender('player', this.magnetURI)
    // TODO: handle roomId display
  }

  socketOnPlay(payload) {
    console.log('got play event: ', payload)
    if (this.videoElem.readyState >= 3) {
      this.videoElem.currentTime = payload.time
      this.videoElem.play()
    }
  }

  socketOnPause(payload) {
    console.log('got pause event: ', payload)
    this.videoElem.pause()
  }

  /*
   * helper functions - could use some refractoring
   */

  getExtension(filename) {
    const parts = filename.split('.')
    return parts[parts.length - 1]
  }

  isVideo(filename) {
    const ext = this.getExtension(filename)
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'mp4':
      // case 'mpg':
      // case 'mkv':
        return true
      default:
        return false
    }
  }
}
