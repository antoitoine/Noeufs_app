// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth,  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7tVwHxkcYpV8L0lRaPU--QM2_wuP-Z3w",
  authDomain: "noeufs.firebaseapp.com",
  projectId: "noeufs",
  storageBucket: "noeufs.appspot.com",
  messagingSenderId: "142706055377",
  appId: "1:142706055377:web:a4a23ef4b56b85426acdf0",
  measurementId: "G-S5WCESPM3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);

export { app, auth }
