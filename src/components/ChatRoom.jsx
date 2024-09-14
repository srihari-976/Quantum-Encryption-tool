import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { db, storage } from '../firebaseConfig'; // Import Firebase configurations
import { collection, writeBatch, addDoc, onSnapshot, getDocs, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CryptoJS from 'crypto-js'; // Import crypto-js
import './ChatRoom.css';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; // Use environment variable for key

function encryptMessage(message) {
  try {
    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return message; // Return unencrypted message if encryption fails
  }
}

function decryptMessage(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return cipherText; // Return encrypted text if decryption fails
  }
}

function ChatRoom() {
  const { roomName } = useParams();
  const location = useLocation();
  const userName = new URLSearchParams(location.search).get('name');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [userList, setUserList] = useState([]);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false); // Track if encryption is enabled

  useEffect(() => {
    // Reference to users collection in the chat room
    const usersRef = collection(db, 'rooms', roomName, 'users');

    // Fetch and track users
    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(usersRef);
        const users = userSnapshot.docs.map(doc => doc.data().name);
        setUserList(users);

        if (!users.includes(userName)) {
          // Add the current user to the users list in the database if not present
          await addDoc(usersRef, { name: userName });
        }

        // Enable encryption if there are more than 2 users
        if (users.length >= 2) {
          setEncryptionEnabled(true);
          await encryptExistingMessages(); // Encrypt existing messages
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    // Listen for real-time updates to the user list
    const unsubscribeFromUsers = onSnapshot(usersRef, (snapshot) => {
      const updatedUserList = snapshot.docs.map(doc => doc.data().name);
      setUserList(updatedUserList);

      // Enable encryption if user count exceeds 2
      if (updatedUserList.length >= 3) {
        setEncryptionEnabled(true);
        encryptExistingMessages(); // Encrypt existing messages
      }
    });

    // Reference to messages collection in the chat room
    const messagesRef = collection(db, 'rooms', roomName, 'messages');

    // Listen for real-time updates to the messages
    const unsubscribeFromMessages = onSnapshot(messagesRef, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
      console.log('Messages updated:', msgs);
    });

    return () => {
      unsubscribeFromUsers();
      unsubscribeFromMessages();
    };
  }, [roomName, userName]);

  // Encrypt existing messages when encryption is enabled
  const encryptExistingMessages = async () => {
    const messagesRef = collection(db, 'rooms', roomName, 'messages');
    const messagesSnapshot = await getDocs(messagesRef);

    const batch = writeBatch(db); // Correctly initiate a batch write
    messagesSnapshot.forEach((messageDoc) => {
      const messageData = messageDoc.data();
      if (!messageData.encrypted) { // Only encrypt if not already encrypted
        const encryptedText = encryptMessage(messageData.text);
        console.log('Encrypting message:', messageData.text, '->', encryptedText);
        const messageRef = doc(db, 'rooms', roomName, 'messages', messageDoc.id);
        batch.update(messageRef, { text: encryptedText, encrypted: true });
      }
    });

    await batch.commit(); // Commit the batch
    console.log('Existing messages encrypted successfully.');
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const textToSend = encryptionEnabled ? encryptMessage(message) : message;
      try {
        await addDoc(collection(db, 'rooms', roomName, 'messages'), {
          sender: userName,
          text: textToSend,
          timestamp: new Date(),
          encrypted: encryptionEnabled, // Mark message as encrypted if applicable
        });
        console.log('Message sent:', textToSend);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSendFile = async () => {
    if (file) {
      try {
        const fileRef = ref(storage, `rooms/${roomName}/${file.name}`);
        await uploadBytes(fileRef, file);
        const fileURL = await getDownloadURL(fileRef);
        await addDoc(collection(db, 'rooms', roomName, 'messages'), {
          sender: userName,
          text: `File uploaded: <a href="${fileURL}" target="_blank">${file.name}</a>`,
          timestamp: new Date(),
          encrypted: false, // Files are not encrypted
        });
        console.log('File sent:', fileURL);
        setFile(null);
      } catch (error) {
        console.error('Error sending file:', error);
      }
    }
  };

  return (
    <div className="chat-room">
      <h2>Chat Room: {roomName}</h2>
      <p>Welcome, {userName}!</p>
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.sender}:</strong>
              {msg.encrypted ? decryptMessage(msg.text) : msg.text}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={handleSendMessage}>Send</button>
          <label className="file-upload-label">
            <input type="file" onChange={handleFileChange} />
          </label>
          <button className="send-file" onClick={handleSendFile}>Send File</button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
