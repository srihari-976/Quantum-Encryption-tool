import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterRoom.css'; // Import external CSS if needed

function EnterRoom() {
  const [name, setName] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (name && passphrase) {
      // Save the name and passphrase to the local storage or a global state
      localStorage.setItem('name', name);
      localStorage.setItem('passphrase', passphrase);

      // Navigate to the chat room with the passphrase
      navigate(`/chat-room/${encodeURIComponent(passphrase)}`);
    } else {
      alert("Please enter both name and passphrase.");
    }
  };

  return (
    <div className="enter-room">
      <h2>Enter Chat Room</h2>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="passphrase">Passphrase</label>
        <input
          type="text"
          id="passphrase"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Enter passphrase"
        />
      </div>
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
}

export default EnterRoom;
