// src/firebaseConfig.jsx

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "ai-travel-planner-23f63.firebaseapp.com",
  databaseURL: "https://ai-travel-planner-23f63-default-rtdb.firebaseio.com",
  projectId: "ai-travel-planner-23f63",
  storageBucket: "ai-travel-planner-23f63.appspot.com",
  messagingSenderId: "157479820651",
  appId: "1:157479820651:web:d8e0f87ed9dca83bcf002e",
  measurementId: "G-16LL1F2KMB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db
};
