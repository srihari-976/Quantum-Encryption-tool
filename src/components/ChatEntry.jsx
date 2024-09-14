import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatEntry() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      // Navigate to the chat room with the user's name
      navigate(`/chat-room`, { state: { userName: name } });
    }
  };

  return (
    <div className="chat-entry">
      <h2>Enter your name to join the chat room</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="submit">Join Chat Room</button>
      </form>
    </div>
  );
}

export default ChatEntry;
