import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCT6aEJvqP8bMWGkBQiv3eRUiHkYauFKow',
  authDomain: 'manah-aarogya.firebaseapp.com',
  projectId: 'manah-aarogya',
  storageBucket: 'manah-aarogya.firebasestorage.app',
  messagingSenderId: '852278303030',
  appId: '1:852278303030:web:cd528bbaa369441a5e7b97',
  measurementId: 'G-5HFJRLC6DM',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch(() => {
  // Keep the sign-in flow usable even if persistence is blocked.
});

const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut as firebaseSignOut };
