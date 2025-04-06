// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnVYOt74F7GU639_X0txLXKTIRDPXcyuE",
  authDomain: "trendmind-b1156.firebaseapp.com",
  projectId: "trendmind-b1156",
  storageBucket: "trendmind-b1156.appspot.com",
  messagingSenderId: "404409989238",
  appId: "1:404409989238:web:ed1c1ea5ad38ed1425c757"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the auth and db services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.log('Persistence not available in this browser');
    }
  });

export { firebase, auth, db }; 