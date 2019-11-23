import React, { useState } from 'react'
import RoomPrompt from './RoomPrompt'
import io from 'socket.io-client'
import './App.css'
import VideoPlayer from './VideoPlayer'

interface RouteActions {
  roomPrompt: React.ReactElement,
  error: React.ReactElement
}

interface SocketPayload {
  roomId: string,
  magnetURI: string,
  isPlaying: boolean,
  startAt: number,
  time: number,
}

const App: React.FC = () => {
  const [username, setUsername] = useState('')
  const [videoURI, setVideoURI] = useState('')
  const [roomId, setRoomId] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [startAt, setStartAt] = useState(0)
  const [route, setRoute] = useState('roomPrompt')
  const socket: SocketIOClient.Socket = io(
    "http://lobster.linoman.net/"
  )

  const handleJoinRoom = () => {
    socket.emit('new user', {
      name: username,
      roomId: roomId,
      magnetURI: videoURI
    })
  }

  const handlePlayToggle = (shouldPlay: boolean, time: number) => {
    if (shouldPlay) {
      socket.emit('play', { time })
    } else {
      socket.emit('pause')
    }
    console.log('should play:', shouldPlay)
  }

  socket.on('join room', (payload: SocketPayload) => {
    if (!videoURI) {
      setVideoURI(payload.magnetURI)
    } else if (!roomId) {
      setRoomId(payload.roomId)
    }
    setRoute('videoPlayer')
    console.log('we have a live socket!!', payload)
  })

  socket.on('play', (payload: SocketPayload) => {
    console.log('got play event: ', payload)
    setStartAt(payload.time)
    setIsPlaying(true)
  })

  socket.on('pause', (payload: SocketPayload) => {
    console.log('got pause event: ', payload)
    setIsPlaying(false)
  })

  const resolveRoute = (route: string) => {
    switch(route) {
      case 'roomPrompt':
        return (
          <RoomPrompt
            username={username}
            videoURI={videoURI}
            roomId={roomId}
            onJoinRoom={handleJoinRoom}
            setUsername={setUsername}
            setVideoURI={setVideoURI}
            setRoomId={setRoomId}
          />
        )
      case 'videoPlayer':
        return (
          <VideoPlayer
            username={username}
            videoURI={videoURI}
            roomId={roomId}
            isPlaying={isPlaying}
            startAt={startAt}
            onPlayToggle={handlePlayToggle}
          />
        )
      default:
        return <div className="light">Ooooooppsie</div>
    }
  }

  return (
    <div className="flex items-center justify-center">
      {resolveRoute(route)}
    </div>
  )
}

export default App
