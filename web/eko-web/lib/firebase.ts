import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAY8XQ7YTFY1eXOoDOcU74KhxMiMyvicsU",
  authDomain: "ekomantra.firebaseapp.com",
  projectId: "ekomantra",
  storageBucket: "ekomantra.firebasestorage.app",
  messagingSenderId: "729566115016",
  appId: "1:729566115016:web:4e044c3479734d617b21fd",
  measurementId: "G-LXQE1QD9TD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics conditionally (it runs only on client-side)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics, db };
