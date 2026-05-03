import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq4Mkupa5z7qKCsE0ji9s1FEuxf__41Cs",
  authDomain: "portfolio-cms-49f6a.firebaseapp.com",
  projectId: "portfolio-cms-49f6a",
  storageBucket: "portfolio-cms-49f6a.firebasestorage.app",
  messagingSenderId: "973511860833",
  appId: "1:973511860833:web:7fd69f2d05da74aacc4020"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, signInWithEmailAndPassword, signOut, onAuthStateChanged };