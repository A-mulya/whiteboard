import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../index.css';

const CreateRoom = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const id = uuidv4().slice(0, 8); // short readable ID
    navigate(`/whiteboard/${id}`);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      navigate(`/whiteboard/${roomId.trim()}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Join or Create a Private Room</h2>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
          <button className="submit-btn" onClick={handleJoinRoom}>
            Join Room
          </button>
          <button className="submit-btn" onClick={handleCreateRoom}>
            Create Private Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
