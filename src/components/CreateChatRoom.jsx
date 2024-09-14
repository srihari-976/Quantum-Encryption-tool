import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CreateChatRoom.css';

function CreateChatRoom() {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userName = new URLSearchParams(location.search).get('name');

  const handleCreateRoom = () => {
    if (!userName.trim()) {
      alert("Please enter your name before creating a room.");
      return;
    }
    if (!roomName.trim()) {
      alert("Room name cannot be empty.");
      return;
    }

    console.log('Chat room created:', roomName);

    // Navigate to the chat room page with the room name and user name
    navigate(`/chat-room/${encodeURIComponent(roomName)}?name=${encodeURIComponent(userName)}`);
  };

  return (
    <div className="create-chat-room">
      <h2>Create a New Chat Room</h2>
      <div className="form-group">
        <label htmlFor="roomName">Room Name</label>
        <input
          type="text"
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
        />
      </div>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
}

export default CreateChatRoom;
