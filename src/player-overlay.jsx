import React from 'react'

export default class PlayerOverlay extends React.Component {

  render() {
    return (
      <div className="vw100 vh100 overlay">
        <footer className="absolute bottom ctrl-bar col-12 flex justify-between items-center">
          <button
            className="playPause flex items-center justify-center border-none p1"
            onClick={this.props.onPlayToggle}
          >
            <i className="material-icons light">
              { this.props.isPlaying ? 'pause' : 'play_arrow' }
            </i>
          </button>
          <span className="mr1">Room ID: {this.props.roomId}</span>
        </footer>
      </div>
    )
  }
}
