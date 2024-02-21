import React, { useState } from 'react'

export const JoinRoom = ({onJoin}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    
    return (
        <div className="container py-5">
          <div className="join-room-box bg-light p-3 rounded border text-center">
            <div>
              <input
                type="text"
                className="form-control my-2"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                className="form-control my-2"
                placeholder="Enter a 5-digit room code..."
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
              <button className="btn btn-primary" onClick={() => onJoin(name, room)}>Join Room</button>
            </div>
          </div>
        </div>
      );
}
