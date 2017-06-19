import React from 'react'
import PlayerOverlay from './player-overlay'

export default class VideoPlayer extends React.Component {

  constructor(props) {
    super(props)
    this.onPlayToggle = this.onPlayToggle.bind(this)
  }

  onPlayToggle() {
    this.props.onPlayToggle()
  }

  render() {
    return (
      <div className="relative">
        <div className="absolute top vw100 vh100">
          <video id="player"/>
        </div>
        <PlayerOverlay
          isPlaying={this.props.isPlaying}
          onPlayToggle={this.onPlayToggle}
        />
      </div>
    )
  }
}
