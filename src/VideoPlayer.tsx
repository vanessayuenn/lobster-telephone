import React, { useRef } from 'react'
import ReactPlayer from 'react-player'

export type VideoPlayerProps = {
  username: string
  videoURI: string
  roomId: string
  isPlaying: boolean
  startAt: Number
  onPlayToggle: Function
};

const VideoPlayer: React.FC<VideoPlayerProps> = (props:VideoPlayerProps) => {

  let playerRef = useRef<ReactPlayer>(null)
  const onPlayToggle = () => {
    // props.onPlayToggle(playerRef.current!.getCurrentTime())
    console.log(props.isPlaying ? 'Pause' : 'Play',playerRef.current!.getCurrentTime());

  }

  return (
    <div className="flex items-center bg-black">
      <ReactPlayer
        ref={playerRef}
        url="https://s16-cf.put.io/download/584391754?stream=1&u=UOcCBx4gdGQyTfIyPYDp-7Fu6TZurbV-hfLfaEjDr0qd_bQQfsapWvcWggydphv8yPcrAo-eOpr_VwcFkCeM2g%3D%3D&oauth_token=KVZ32RB7LWUT7YAQTNHZ"
        controls={true}
        playing={props.isPlaying}
        onPlay={onPlayToggle}
        onPause={onPlayToggle}
      />
    </div>
  );
}

export default VideoPlayer