import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Ceylisse Lanka - Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPuRzmF1d2BUComzAZ0mb6ZgOtodIjVuw",
    authDomain: "ceylisse-lanka.firebaseapp.com",
    projectId: "ceylisse-lanka",
    storageBucket: "ceylisse-lanka.firebasestorage.app",
    messagingSenderId: "880092495711",
    appId: "1:880092495711:web:303a61c568a6e1845580ea",
    measurementId: "G-4X7PV1LF5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Services for the store
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("Firebase App Initialized:", app.name);
console.log("Auth Initialized:", auth ? "Yes" : "No");

// Export variables to use in other files
export { auth, db, storage };
