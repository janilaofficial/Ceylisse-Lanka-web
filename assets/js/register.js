import { registerUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form values
            const name = registerForm.querySelector('input[type="text"]').value;
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;

            // Basic Validation
            if (password.length < 6) {
                alert("Password should be at least 6 characters long.");
                return;
            }

            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Creating Account...";
            submitBtn.disabled = true;

            // Attempt Register
            const result = await registerUser(email, password, name);

            if (result.success) {
                alert("Account created successfully! Redirecting...");
                window.location.href = 'index.html';
            } else {
                alert("Error: " + result.error);
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
