import React, { useState } from 'react';
import './encryption.css';
import CryptoJS from 'crypto-js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Simulated Kyber functions for encryption
const simulateKyberEncrypt = (message) => {
  return new Promise((resolve) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const ciphertext = Array.from(data).map((byte, i) => byte ^ randomBytes[i % 32]);
    resolve({
      ciphertext: ciphertext.join(','),
      encapsulatedKey: Array.from(randomBytes).join(',')
    });
  });
};

function Encryption() {
  const [inputText, setInputText] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [key, setKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [encryptionMethod, setEncryptionMethod] = useState('AES-256');

  const handleEncrypt = async () => {
    let encrypted;
    let generatedKey = '';

    if (encryptionMethod === 'AES-256') {
      // AES-256 encryption logic
      encrypted = CryptoJS.AES.encrypt(inputText, passphrase).toString();
    } else if (encryptionMethod === 'Kyber') {
      // Kyber encryption logic
      const { ciphertext, encapsulatedKey } = await simulateKyberEncrypt(inputText);
      encrypted = ciphertext;
      generatedKey = encapsulatedKey;
    }else if (encryptionMethod === 'Hybrid') {
      // Generate random AES key (32 bytes for AES-256)
      const aesKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    
      // AES-256 encryption with generated AES key
      const aesEncrypted = CryptoJS.AES.encrypt(inputText, aesKey).toString();
    
      // Encrypt AES key using Kyber
      const { encapsulatedKey: kyberKey } = await simulateKyberEncrypt(aesKey);
    
      // Encode AES encrypted text and Kyber key in Base64
      const encodedAesEncrypted = btoa(aesEncrypted);
      const encodedKyberKey = btoa(kyberKey);
    
      // Combine AES encrypted text and Kyber encrypted AES key
      encrypted = `${encodedAesEncrypted}|||${encodedKyberKey}`;
      generatedKey = kyberKey; // Kyber encrypted key
    }
    
    
    
    
    

    // Set encrypted text and key
    setEncryptedText(encrypted);
    setKey(generatedKey);

    // Store encryption details to Firestore
    await addDoc(collection(db, 'encryptionDetails'), {
      key: generatedKey || passphrase,
      encryptionMethod: encryptionMethod,
      timestamp: serverTimestamp(),
    }).catch(error => console.error('Error storing data: ', error));
  };

  return (
    <div className="page">
      <h2>Encryption</h2>

      <div className="form-group">
        <label htmlFor="inputText">Input Text</label>
        <textarea
          id="inputText"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows="4"
        />
      </div>

      <div className="form-group">
        <legend>Encryption Method</legend>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="encryptionMethod"
              value="AES-256"
              checked={encryptionMethod === 'AES-256'}
              onChange={(e) => setEncryptionMethod(e.target.value)}
            />
            AES-256
          </label>
          <label>
            <input
              type="radio"
              name="encryptionMethod"
              value="Kyber"
              checked={encryptionMethod === 'Kyber'}
              onChange={(e) => setEncryptionMethod(e.target.value)}
            />
            Kyber (Post-Quantum)
          </label>
          <label>
            <input
              type="radio"
              name="encryptionMethod"
              value="Hybrid"
              checked={encryptionMethod === 'Hybrid'}
              onChange={(e) => setEncryptionMethod(e.target.value)}
            />
            Hybrid (AES-256 + Kyber)
          </label>
        </div>
      </div>

      {encryptionMethod === 'AES-256' && (
        <div className="form-group">
          <label htmlFor="passphrase">Passphrase (for AES-256)</label>
          <input
            type="text"
            id="passphrase"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleEncrypt}>Encrypt</button>

      <div className="form-group">
        <label htmlFor="encryptedText">Encrypted Text</label>
        <textarea
          id="encryptedText"
          value={encryptedText}
          readOnly
          rows="4"
        />
      </div>

      <div className="form-group">
        <label htmlFor="key">Generated Key (for Kyber and Hybrid)</label>
        <input
          type="text"
          id="key"
          value={key}
          readOnly
        />
      </div>
    </div>
  );
}

export default Encryption;
