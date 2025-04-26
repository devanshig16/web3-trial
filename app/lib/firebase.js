// app/lib/firebase.js
import { getFirestore } from 'firebase/firestore';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSd3k7vZQxzm7a01Le0Rx5PDVNuMcoeQM",
  authDomain: "decent-hiring.firebaseapp.com",
  projectId: "decent-hiring",
  storageBucket: "decent-hiring.firebasestorage.app",
  messagingSenderId: "875648488309",
  appId: "1:875648488309:web:3da3786e1332355bbd393c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };