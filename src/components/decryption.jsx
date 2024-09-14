import React, { useState } from 'react';
import './encryption.css';
import CryptoJS from 'crypto-js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Simulated Kyber functions
const simulateKyberDecrypt = (ciphertext, encapsulatedKey) => {
  const ciphertextArray = ciphertext.split(',').map(Number);
  const keyArray = encapsulatedKey.split(',').map(Number);
  const decrypted = new Uint8Array(ciphertextArray.length);
  for (let i = 0; i < ciphertextArray.length; i++) {
    decrypted[i] = ciphertextArray[i] ^ keyArray[i % keyArray.length];
  }
  return new TextDecoder().decode(decrypted);
};

function Decryption() {
  const [encryptedText, setEncryptedText] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [encryptionMethod, setEncryptionMethod] = useState('AES-256');
  const [key, setKey] = useState('');

  const handleDecrypt = () => {
    let decrypted = '';

    try {
      switch (encryptionMethod) {
        case 'AES-256':
          const bytes = CryptoJS.AES.decrypt(encryptedText, passphrase);
          decrypted = bytes.toString(CryptoJS.enc.Utf8);
          if (!decrypted) throw new Error('Failed to decrypt');
          break;
        case 'Kyber':
          decrypted = simulateKyberDecrypt(encryptedText, key);
          break;
          case 'Hybrid':
  // Split encrypted text into Kyber-encrypted AES part and Kyber-encrypted AES key
  const [kyberEncryptedText, kyberEncryptedKey] = encryptedText.split('|||');

  // Decrypt Kyber-encrypted AES key
  const recoveredAesKey = simulateKyberDecrypt(kyberEncryptedKey, key);

  // Decrypt Kyber-encrypted text to retrieve AES-encrypted text
  const aesEncrypted = simulateKyberDecrypt(kyberEncryptedText, recoveredAesKey);

  // Use recovered AES key to decrypt AES-encrypted text
  const aesBytes = CryptoJS.AES.decrypt(aesEncrypted, recoveredAesKey, { inputEncoding: CryptoJS.enc.Hex });
  decrypted = aesBytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) throw new Error('Failed to decrypt');
  break;




          
        default:
          throw new Error('Unknown decryption method');
      }
    } catch (error) {
      console.error('Decryption error:', error);
      decrypted = `Decryption failed. ${error.message}`;
    }

    setDecryptedText(decrypted);

    // Store decryption details to Firestore
    addDoc(collection(db, 'decryptionDetails'), {
      key: key,
      passphrase: passphrase,
      encryptionMethod: encryptionMethod,
      decryptedText: decrypted,
      timestamp: serverTimestamp(),
    }).catch(error => console.error('Error storing data: ', error));
  };

  return (
    <div className="page">
      <h2>Decryption</h2>

      <div className="form-group">
        <label htmlFor="encryptedText">Encrypted Text</label>
        <textarea
          id="encryptedText"
          value={encryptedText}
          onChange={(e) => setEncryptedText(e.target.value)}
          rows="4"
        />
      </div>

      <div className="form-group">
        <legend>Decryption Method</legend>
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

      {(encryptionMethod === 'Kyber' || encryptionMethod === 'Hybrid') && (
        <div className="form-group">
          <label htmlFor="key">Key (for Kyber and Hybrid)</label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleDecrypt}>Decrypt</button>

      <div className="form-group">
        <label htmlFor="decryptedText">Decrypted Text</label>
        <textarea
          id="decryptedText"
          value={decryptedText}
          readOnly
          rows="4"
        />
      </div>
    </div>
  );
}

export default Decryption;
