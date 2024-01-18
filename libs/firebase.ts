// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClTBV46uyDv6gfOAcwQm1w16pSvAI_IOI",
  authDomain: "eshoppy-a1c97.firebaseapp.com",
  projectId: "eshoppy-a1c97",
  storageBucket: "eshoppy-a1c97.appspot.com",
  messagingSenderId: "519765731200",
  appId: "1:519765731200:web:2083cc378c0441ec1a8365",
  measurementId: "G-NCM5JDQ9QT"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;