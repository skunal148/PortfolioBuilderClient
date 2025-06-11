// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoBtK77VWCQxsscAdjIvGsaPgiNXjgqFI",
  authDomain: "website-builder-45fca.firebaseapp.com",
  projectId: "website-builder-45fca",
  storageBucket: "website-builder-45fca.appspot.com",
  messagingSenderId: "43778708268",
  appId: "1:43778708268:web:ddf28e30eee65364251289",
  measurementId: "G-H25Y0X3F47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics };