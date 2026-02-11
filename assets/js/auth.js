import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Register User
export async function registerUser(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Profile
        await updateProfile(user, { displayName: fullName });

        // Save extra user details to Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: email,
            displayName: fullName,
            role: "user", // Default role
            createdAt: new Date().toISOString()
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Login User
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout User
export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Check User Role (for Admin protection)
export async function getUserRole(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().role;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
}

// Auth State Observer
export function initAuthObserver() {
    onAuthStateChanged(auth, async (user) => {
        const loginLink = document.querySelector('a[href="login.html"]');

        if (user) {
            console.log("User logged in:", user.email);
            if (loginLink) {
                // Change Login icon to Logout or Profile
                // Check if current page is login/register, redirect to home
                const path = window.location.pathname;
                if (path.includes('login.html') || path.includes('register.html')) {
                    window.location.href = 'index.html';
                }

                // Update UI to show logged in state
                // This is a simple implementation, can be expanded
                loginLink.href = "#logout";
                loginLink.innerHTML = `<i data-lucide="log-out" class="w-5 h-5"></i>`;
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutUser();
                });

                if (window.lucide) window.lucide.createIcons();
            }
        } else {
            console.log("User logged out");
            if (loginLink) {
                loginLink.href = "login.html";
                loginLink.innerHTML = `<i data-lucide="user" class="w-5 h-5"></i>`;
                if (window.lucide) window.lucide.createIcons();
            }
        }
    });
}
