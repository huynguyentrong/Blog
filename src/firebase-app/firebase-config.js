import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBpw_1z2KMURdUowBCRjPpslblPnx2dTy0",
  authDomain: "monkey-blogging-cd4c9.firebaseapp.com",
  projectId: "monkey-blogging-cd4c9",
  storageBucket: "monkey-blogging-cd4c9.appspot.com",
  messagingSenderId: "728897152832",
  appId: "1:728897152832:web:f8e896e36dd0fa35b37ca5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
