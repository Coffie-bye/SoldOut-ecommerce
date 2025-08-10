// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  updateEmail
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYcJnzYODrfcdkT5qAY6Bo5BTF4--IkQ8",
  authDomain: "login-d08d2.firebaseapp.com",
  projectId: "login-d08d2",
  storageBucket: "login-d08d2.firebasestorage.app",
  messagingSenderId: "70139036683",
  appId: "1:70139036683:web:f9d9f2c576f17baa83330e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { 
  auth, 
  provider, 
  db,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  updateEmail,
  doc,
  setDoc,
  serverTimestamp
};