// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
import { getAuth } from "firebase/auth";
 
const firebaseConfig = {
  apiKey: "AIzaSyDxCmwrKA1Qwh1MFd_7B23sgA7WU3qIlEE",
  authDomain: "react-auth-61f92.firebaseapp.com",
  projectId: "react-auth-61f92",
  storageBucket: "react-auth-61f92.firebasestorage.app",
  messagingSenderId: "123862995419",
  appId: "1:123862995419:web:83fd3593540fecce1ad7fe",
  measurementId: "G-GK1QN8LLX2"
};

// Initialize Firebasefire
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
