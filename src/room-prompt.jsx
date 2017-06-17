import React from 'react'

export default class RoomPrompt extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: '',
      username: '',
      roomId: '',
      magnetLink: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log(event.target)
    return false
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  select(action) {
    this.setState({
      selected: action,
      roomId: '',
      magnetLink: '',
    })
  }

  render() {
    return (
      <div className="flex flex-column">
        <div className="flex">
          <button
            className="p3 mr3 border pointer"
            onClick={() => this.select('new room')}
          >
            <i className="material-icons">add_to_queue</i>
          </button>
          <button
            className="p3 border pointer"
            onClick={() => this.select('join room')}
          >
            <i className="material-icons">exit_to_app</i>
          </button>
        </div>
        <form onSubmit={this.handleSubmit} className="flex flex-column my3 items-stretch">
          <input
            type="text"
            name="username"
            className="border p1"
            placeholder="Your Name"
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name={this.state.selected === 'new room' ? 'magnetLink' : 'roomId'}
            className="border p1 my1"
            value={this.state.selected === 'new room' ? this.state.magnetLink : this.state.roomId}
            placeholder={this.state.selected === 'new room' ? 'Magnet Link' : 'Room ID'}
            onChange={this.handleInputChange}
          />
          <a
            className="h5 text-decoration-none flex items-center"
            href="/"
            onClick={this.handleSubmit}
          >
            <i className="material-icons mr1">arrow_forward</i>
            {this.state.selected === 'new room' ? 'Make New Room' : 'Join Room'}
          </a>
          <input type="submit" value="Submit" hidden />
        </form>
      </div>
    )
  }
}
