import React from 'react'
import SocketClient from 'socket.io-client'
import RoomPrompt from './room-prompt'
import VideoPlayer from './video-player'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      route: 'roomPrompt',
      username: '',
      magnetURI: '',
      roomId: '',
      isPlaying: false,
      startAt: 0
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleJoinRoom = this.handleJoinRoom.bind(this)
    this.handlePlayToggle = this.handlePlayToggle.bind(this)

    this.socket = new SocketClient('https://lobster-telephone.herokuapp.com/')
    // this.socket = new SocketClient('http://localhost:1337')
    this.socket.on('play', this.socketOnPlay.bind(this))
    this.socket.on('pause', this.socketOnPause.bind(this))
    this.socket.on('join room', this.socketOnJoinRoom.bind(this))
  }

  socketOnJoinRoom (payload) {
    if (!this.state.magnetURI) {
      this.setState({
        magnetURI: payload.magnetURI,
        route: 'videoPlayer'
      })
    } else if (!this.state.roomId) {
      this.setState({
        roomId: payload.roomId,
        route: 'videoPlayer'
      })
    }
  }

  socketOnPlay (payload) {
    console.log('got play event: ', payload)
    this.setState({ isPlaying: true, startAt: payload.time })
  }

  socketOnPause (payload) {
    console.log('got pause event: ', payload)
    // this.videoElem.pause()
    this.setState({ isPlaying: false })
  }

  handleInputChange (key, value) {
    this.setState({ [key]: value })
  }

  handleJoinRoom () {
    this.socket.emit('new user', {
      name: this.state.username,
      roomId: this.state.roomId,
      magnetURI: this.state.magnetURI
    })
  }

  handlePlayToggle (time) {
    if (this.state.isPlaying === false) {
      this.socket.emit('play', { time })
    } else {
      this.socket.emit('pause')
    }
  }

  resolveRoute () {
    const routeActions = {
      roomPrompt: (
        <RoomPrompt
          username={this.state.username}
          magnetURI={this.state.magnetURI}
          roomId={this.state.roomId}
          onInputChange={this.handleInputChange}
          onJoinRoom={this.handleJoinRoom}
        />
      ),
      videoPlayer: (
        <VideoPlayer
          username={this.state.username}
          magnetURI={this.state.magnetURI}
          roomId={this.state.roomId}
          isPlaying={this.state.isPlaying}
          startAt={this.state.startAt}
          onPlayToggle={this.handlePlayToggle}
        />
      ),
      error: (
        <div>Ooooooppsie</div>
      )
    }
    return routeActions[this.state.route] || routeActions.error
  }

  render () {
    return (
      <div className='flex items-center justify-center'>
        {this.resolveRoute()}
      </div>
    )
  }
}
