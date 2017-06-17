import React from 'react'
import RoomPrompt from './room-prompt'
import controller from './controller'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      route: 'roomPrompt',
      username: '',
      magnetURI: '',
      roomId: '',
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleJoinRoom = this.handleJoinRoom.bind(this)
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value })
  }

  handleJoinRoom() {
    controller.joinRoom(this.state.username, this.state.roomId)
    this.setState({ route: 'videoPlayer' })
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
