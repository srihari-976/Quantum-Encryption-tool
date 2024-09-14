// encryptionUtils.js
import CryptoJS from 'crypto-js';

export const encryptMessage = (message, passphrase) => {
  return CryptoJS.AES.encrypt(message, passphrase).toString();
};

export const decryptMessage = (ciphertext, passphrase) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
};
