// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWFbohde2uah1yQMPcpHcX6btaGoXM8rQ",
  authDomain: "smart-medical-d4082.firebaseapp.com",
  projectId: "smart-medical-d4082",
  storageBucket: "smart-medical-d4082.firebasestorage.app",
  messagingSenderId: "231889763870",
  appId: "1:231889763870:web:15bbd6304643e8bdc7b80f",
  measurementId: "G-08XKX7D18P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export{app,auth};