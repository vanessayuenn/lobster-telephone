import React from 'react'

export default class PlayerOverlay extends React.Component {
  //
  // constructor(props) {
  //   super(props)
  // }

  render() {
    return (
      <div className="vw100 vh100 overlay">
        <footer className="absolute bottom ctrl-bar col-12 flex">
          <button
            className="playPause flex items-center justify-center border-none p1"
            onClick={this.props.onPlayToggle}
          >
            <i className="material-icons light">
              { this.props.isPlaying ? 'pause' : 'play_arrow' }
            </i>
          </button>
          &nbsp;
        </footer>
      </div>
    )
  }
}
