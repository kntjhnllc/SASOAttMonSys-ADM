// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgLP2cIBoCaZxmdMHwE5vbiSwKQgcDo1Q",
  authDomain: "sasoattmonsys.firebaseapp.com",
  projectId: "sasoattmonsys",
  storageBucket: "sasoattmonsys.appspot.com",
  messagingSenderId: "186194623543",
  appId: "1:186194623543:web:2f9645b4ed17fe8b2c53b2",
  measurementId: "G-E3Y1E7ZPNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);