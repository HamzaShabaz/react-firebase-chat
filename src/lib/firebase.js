import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtqZiHK9ILROyz0JhMq4d6SvFgQ7BWz7E",
  authDomain: "new-demo-f7a3a.firebaseapp.com",
  projectId: "new-demo-f7a3a",
  storageBucket: "new-demo-f7a3a.appspot.com",
  messagingSenderId: "920538818870",
  appId: "1:920538818870:web:e5a105a59ea20086f06b97",
  measurementId: "G-PCJSDCYTCP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()