
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAizj2leo_6NCKsqTSvMCsHYuoivJsiAi8",
  authDomain: "studio-9299153140-4c005.firebaseapp.com",
  projectId: "studio-9299153140-4c005",
  storageBucket: "studio-9299153140-4c005.appspot.com",
  messagingSenderId: "1086856524439",
  appId: "1:1086856524439:web:203ea3596e3b5255f9efd2",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
