import React from 'react'
import Controller from './controller'
import RoomPrompt from './room-prompt'
import VideoPlayer from './video-player'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      route: 'roomPrompt',
      username: '',
      magnetURI: '',
      roomId: '',
      isPlaying: false,
    }
    this.ctrl = new Controller()
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleJoinRoom = this.handleJoinRoom.bind(this)
    this.handlePlayToggle = this.handlePlayToggle.bind(this)
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value })
  }

  handleJoinRoom() {
    this.ctrl.socketJoinRoom(this.state.username, this.state.roomId)
    this.setState({ route: 'videoPlayer' })
  }

  handlePlayToggle() {
    this.setState({ isPlaying: !this.state.isPlaying }, (wat) => {
      console.warn('play toggle: ', wat)
      this.ctrl.videoPlayPause(this.state.isPlaying ? 'play' : 'pause')
    })
  }

  resolveRoute() {
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
          onPlayToggle={this.handlePlayToggle}
        />
      ),
      error: (
        <div>Ooooooppsie</div>
      ),
    }
    return routeActions[this.state.route] || routeActions.error
  }

  render() {
    return (
      <div className="flex items-center justify-center">
        {this.resolveRoute()}
      </div>
    )
  }
}
