// firebase.js

// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9DYaKVZilGtiNdFY8LSaDVP6_zlzXIFY",
  authDomain: "sumuryanalizer.firebaseapp.com",
  projectId: "sumuryanalizer",
  storageBucket: "sumuryanalizer.appspot.com",
  messagingSenderId: "787970282886",
  appId: "1:787970282886:web:2097b3ab3dc8a977aec807",
  measurementId: "G-GPWHTXM8PP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (only in browser)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Auth & Google Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Export app and analytics if needed
export { app, analytics };
