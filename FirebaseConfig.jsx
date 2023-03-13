// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQnS8AhRZz9rz4s7BaXpte1oxu-N5aC6s",
  authDomain: "rn-chatapp-84977.firebaseapp.com",
  projectId: "rn-chatapp-84977",
  storageBucket: "rn-chatapp-84977.appspot.com",
  messagingSenderId: "99511104204",
  appId: "1:99511104204:web:86b36a7f0e250cbd160869"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
