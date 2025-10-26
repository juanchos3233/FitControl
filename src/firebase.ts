import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA0iSPJsjr7_XLcrpx-TdQtBRc384tUmkc",
  authDomain: "fitcontrol-9908e.firebaseapp.com",
  projectId: "fitcontrol-9908e",
  storageBucket: "fitcontrol-9908e.firebasestorage.app",
  messagingSenderId: "879877465706",
  appId: "1:879877465706:web:10c9ff09e88b53b6f40c13",
  measurementId: "G-9K7K6FF3EM"
};


const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
