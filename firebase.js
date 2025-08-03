// Firebase Configuration (Replace with your config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Vendor Authentication
function registerVendor(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Save vendor details to Firestore
      db.collection("vendors").doc(userCredential.user.uid).set({
        email: email,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      window.location.href = "vendor-dashboard.html";
    })
    .catch((error) => alert(error.message));
}

function loginVendor(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "vendor-dashboard.html")
    .catch((error) => alert(error.message));
}