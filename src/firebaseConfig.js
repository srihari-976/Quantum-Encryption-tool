import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, writeBatch } from 'firebase/firestore'; // Import writeBatch here
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOtjpRraaK_w_5pyv6sEw78pLDup3p-Vk",
  authDomain: "hamsters-58d67.firebaseapp.com",
  projectId: "hamsters-58d67",
  storageBucket: "hamsters-58d67.appspot.com",
  messagingSenderId: "662817196539",
  appId: "1:662817196539:web:3c4f2ef536f2d064a8635e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const auth = getAuth(app); // Initialize and export storage

// Now export writeBatch correctly along with other Firebase services
export { db, writeBatch, collection, addDoc, storage };
