import React, { useRef, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import {Play, Pause, Circle, Maximize, Minimize} from 'react-feather'

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
  const [isMaximized, setIsMaximized] = useState(false)

  const onPlay = () => props.onPlayToggle(true, playerRef.current ? playerRef.current.getCurrentTime() : 0)
  const onPause = () => props.onPlayToggle(false, playerRef.current ? playerRef.current.getCurrentTime() : 0)

  useEffect(() => {
    if (playerRef.current) {
      props.onPlayToggle(false)
      playerRef.current.seekTo(props.startAt)
    }
  }, [props.startAt])

  return (
    <div className="relative">
      <div className="flex items-center bg-black">
        <ReactPlayer
          ref={playerRef}
          url={props.videoURI}
          controls={false}
          playing={props.isPlaying}
          onPlay={onPlay}
          onPause={onPause}
          />
      </div>
      <div className="overlay flex flex-column justify-end absolute left-0 right-0 bottom-0">
        <div className="flex-auto" onClick={props.isPlaying ? onPause : onPlay}></div>
        <div className="flex justify-between mb1 mx1">
          {props.isPlaying ?
            <Pause color={"white"} onClick={onPause}/> :
            <Play color={"white"} onClick={onPlay}/>
          }
          {isMaximized ?
          <Minimize color={"white"} onClick={() => setIsMaximized(false)}/> :
          <Maximize color={"white"} onClick={() => setIsMaximized(true)}/>
          }
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer