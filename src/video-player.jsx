import React from 'react'
import WebTorrent from 'webtorrent'
import { ipcRenderer } from 'electron'
import PlayerOverlay from './player-overlay'

export default class VideoPlayer extends React.Component {

  constructor(props) {
    super(props)
    this.wtClient = new WebTorrent()
    this.onPlayToggle = this.onPlayToggle.bind(this)
  }

  componentDidMount() {
    if (!this.props.magnetURI) {
      return
    }
    const videoElemId = this.videoElem.id
    this.wtClient.add(this.props.magnetURI, (torrent) => {
      console.log('Client is downloading:', torrent.infoHash, torrent.files)
      const videoFile = torrent.files.find(file => file.name.match(/.*\.mp4$/))
      videoFile.renderTo(`video#${videoElemId}`, { autoplay: false }, (err, elem) => {
        if (err) {
          console.error(`rendering error: ${err}`)
        }
        let [h, w] = [elem.videoHeight, elem.videoWidth]
        if (w > 1200) {
          h = Math.round((900 / w) * h)
          w = 900
        }
        ipcRenderer.send(
          'videoRendered',
          { videoWidth: w, videoHeight: h }
        )
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPlaying !== this.props.isPlaying) {
      if (nextProps.isPlaying) {
        this.videoElem.currentTime = nextProps.startAt
        this.videoElem.play()
      } else {
        this.videoElem.pause()
      }
    }
  }

  onPlayToggle() {
    this.props.onPlayToggle(this.videoElem.currentTime)
  }

  render() {
    return (
      <div className="relative">
        <div className="absolute top vw100 vh100 flex items-center bg-black">
          <video
            id="player"
            className="col-12"
            ref={(elem) => { this.videoElem = elem }}
          />
        </div>
        <PlayerOverlay
          isPlaying={this.props.isPlaying}
          roomId={this.props.roomId}
          onPlayToggle={this.onPlayToggle}
        />
      </div>
    )
  }
}
