import React, { useState, FormEvent } from 'react'

export type RoomPromptProps = {
  username: string
  videoURI: string
  roomId: string
  onJoinRoom: Function
  setUsername: Function
  setVideoURI: Function
  setRoomId: Function
}

const RoomPrompt: React.FC<RoomPromptProps> = (props: RoomPromptProps) => {
  const [action, setAction] = useState('new room')

  const select = (action: string) => {
    setAction(action)
    props.setVideoURI('')
    props.setRoomId('')
  }

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault()
    props.onJoinRoom()
  }

  const [name, value, placeholder, stateSetter, buttonText] =
    action === "new room"
      ? ["videoURI", props.videoURI, "Link to MP4", props.setVideoURI, 'Form a risk']
      : ["roomId", props.roomId, "Room ID", props.setRoomId, 'Join a risk'];

  return (
    <div className="flex flex-column mt2">
      <div className="flex justify-between">
        <button
          className="py1 px2 mr3 border-none bg-black light pointer"
          onClick={() => select("new room")}
        >
          New Room
        </button>
        <button
          className="py1 px2 border-none bg-black light pointer"
          onClick={() => select("join room")}
        >
          Join Room
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-column mt2 items-stretch"
      >
        <input
          type="text"
          name="username"
          className="p1 my1 bg-black light border"
          placeholder="Your Name"
          value={props.username}
          onChange={(e: FormEvent<HTMLInputElement>) =>
            props.setUsername((e.target as HTMLInputElement).value)
          }
        />
        <input
          type="text"
          name={name}
          className="p1 my1 bg-black light border"
          value={value}
          placeholder={placeholder}
          onChange={(e: FormEvent<HTMLInputElement>) =>
            stateSetter((e.target as HTMLInputElement).value)
          }
        />
        <a
          className="flex items-center justify-center"
          href="/"
          onClick={handleSubmit}
        >
          {buttonText}
          <sup>*</sup>
        </a>
        <input type="submit" value="Submit" hidden />
      </form>
      <h5 className="light my1">
        <sup>*</sup> A group of lobster is known as a risk.
      </h5>
    </div>
  );
}

export default RoomPrompt