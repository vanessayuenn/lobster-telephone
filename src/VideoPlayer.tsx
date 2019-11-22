import React, { useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'

export type VideoPlayerProps = {
  username: string
  videoURI: string
  roomId: string
  isPlaying: boolean
  startAt: number
  onPlayToggle: Function
};

const VideoPlayer: React.FC<VideoPlayerProps> = (props:VideoPlayerProps) => {

  let playerRef = useRef<ReactPlayer>(null)
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(props.startAt)
    }
  }, [props.startAt])

  return (
    <div className="flex items-center bg-black">
      <ReactPlayer
        ref={playerRef}
        url={props.videoURI}
        controls={true}
        playing={props.isPlaying}
        onPlay={() => props.onPlayToggle(true, playerRef.current? playerRef.current.getCurrentTime() : 0)}
        onPause={() => props.onPlayToggle(false, playerRef.current ? playerRef.current.getCurrentTime() : 0)}
      />
    </div>
  );
}

export default VideoPlayer