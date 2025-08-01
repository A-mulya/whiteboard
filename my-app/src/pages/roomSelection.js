import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import '../index.css';

const RoomSelection = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const newId = uuid().slice(0, 8);
    navigate(`/whiteboard/${newId}`);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      navigate(`/whiteboard/${roomId.trim()}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Enter Private Room</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
          />
        </div>
        <button className="submit-btn" onClick={handleJoinRoom}>Join Room</button>
        <button className="submit-btn" onClick={handleCreateRoom}>Create New Private Room</button>
      </div>
    </div>
  );
};

export default RoomSelection;
