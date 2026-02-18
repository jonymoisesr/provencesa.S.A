import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvjNyvEzdJxDIqSb6b15lwsmUYUXoMbrA",
  authDomain: "provencesa-bill-gestion.firebaseapp.com",
  projectId: "provencesa-bill-gestion",
  storageBucket: "provencesa-bill-gestion.firebasestorage.app",
  messagingSenderId: "247488651011",
  appId: "1:247488651011:web:c83483db8ed01ec1b89336",
  measurementId: "G-Z35R6W7S6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
