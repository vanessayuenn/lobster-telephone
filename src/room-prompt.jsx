import React from 'react'

export default class RoomPrompt extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      action: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.onJoinRoom()
  }

  handleInputChange(event) {
    this.props.onInputChange(event.target.name, event.target.value)
  }

  select(action) {
    this.setState({ action })
    this.props.onInputChange('magnetURI', '')
    this.props.onInputChange('roomId', '')
  }

  render() {
    return (
      <div className="flex flex-column mt2">
        <div className="flex">
          <button
            className="p3 mr3 border light pointer"
            onClick={() => this.select('new room')}
          >
            <i className="material-icons">add_to_queue</i>
          </button>
          <button
            className="p3 border light pointer"
            onClick={() => this.select('join room')}
          >
            <i className="material-icons">exit_to_app</i>
          </button>
        </div>
        <form onSubmit={this.handleSubmit} className="flex flex-column mt3 items-stretch">
          <input
            type="text"
            name="username"
            className="p2 my1"
            placeholder="Your Name"
            value={this.props.username}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name={this.state.action === 'new room' ? 'magnetURI' : 'roomId'}
            className="p2 my1"
            value={this.state.action === 'new room' ? this.props.magnetURI : this.props.roomId}
            placeholder={this.state.action === 'new room' ? 'Magnet Link' : 'Room ID'}
            onChange={this.handleInputChange}
          />
          <a
            className="h5 text-decoration-none flex items-center"
            href="/"
            onClick={this.handleSubmit}
          >
            <i className="material-icons mr1">arrow_forward</i>
            {this.state.action === 'new room' ? 'Make New Room' : 'Join Room'}
          </a>
          <input type="submit" value="Submit" hidden />
        </form>
      </div>
    )
  }
}
