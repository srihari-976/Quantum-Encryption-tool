import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Encryption from './components/encryption';
import Decryption from './components/decryption';
import CreateChatRoom from './components/CreateChatRoom'; 
import ChatRoom from './components/ChatRoom';
import ChatEntry from './components/ChatEntry';
import EnterRoom from './components/EnterRoom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/encryption" element={<Encryption />} />
          <Route path="/decryption" element={<Decryption />} />
          <Route path="/create-chat-room" element={<CreateChatRoom />} />
          <Route path="/" element={<ChatEntry />} />
          <Route path="/enter-room" component={EnterRoom} />
          <Route path="/chat-room/:roomName" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
