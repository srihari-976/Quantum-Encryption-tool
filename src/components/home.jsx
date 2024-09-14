import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'; // Import external CSS

function Home() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch or load existing rooms from a backend or Firebase
    const fetchRooms = async () => {
      const existingRooms = [
        { id: 'room1', name: 'Room 1' },
        { id: 'room2', name: 'Room 2' },
        // More rooms...
      ];
      setRooms(existingRooms);
    };

    fetchRooms();
  }, []);

  const handleJoinRoom = (roomId) => {
    if (!userName.trim()) {
      alert("Please enter your name before joining a room.");
      return;
    }
    navigate(`/chat-room/${roomId}?name=${encodeURIComponent(userName)}`);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectRoom = (roomId, roomName) => {
    setSelectedRoom(roomName);
    setIsOpen(false);
    handleJoinRoom(roomId);
  };

  return (
    <div className="container">
      <video className="background-video" autoPlay muted loop>
        <source src="/assets/back.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content-overlay">
        <h1>Welcome to the Encryption-Decryption App</h1>
        <p className="subtitle">You can try the features of our encryption and decryption below</p>

        <div className="input-group">
          <label className="userName">Enter your name:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="button-container">
          <button className="encryption-btn" onClick={() => navigate('/encryption')}>Encryption</button>
          <button className="decryption-btn" onClick={() => navigate('/decryption')}>Decryption</button>
        </div>

        <div className="info-section">
          <h2 className='color'>About AES (Advanced Encryption Standard)</h2>
          <p>
            AES is a symmetric encryption algorithm widely used across the globe to secure data. It supports key sizes of 128, 192, and 256 bits, making it a robust standard for both public and private communication. It's commonly used in secure communications such as VPNs, file encryption, and more.
          </p>

          <h2 className='color'>About Kyber</h2>
          <p>
            Kyber is a post-quantum cryptographic algorithm, designed to be secure against attacks from quantum computers. It relies on lattice-based cryptography, which is believed to resist quantum attacks, unlike traditional cryptography systems like RSA or ECC. Kyber is part of the NIST post-quantum cryptography standardization process.
          </p>
        </div>

        {/* Room selection */}
        <div className="info-buttons">
          <button onClick={() => navigate(`/create-chat-room?name=${encodeURIComponent(userName)}`)}>Create Chat Room</button>
          <p>or</p>
          <div className={`custom-select-container ${isOpen ? 'open' : ''}`} onClick={toggleDropdown}>
            <div className="custom-select">
              {selectedRoom || 'Select a Chat Room'}
            </div>
            <div className="custom-select-options">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`custom-select-option ${selectedRoom === room.name ? 'selected' : ''}`}
                  onClick={() => selectRoom(room.id, room.name)}
                >
                  {room.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
