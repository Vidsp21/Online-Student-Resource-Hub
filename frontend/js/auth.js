// ========================================
// AUTHENTICATION - Login & Registration
// ========================================

const API_URL = 'http://localhost:3000/api';

// Show/hide messages
function showMessage(elementId, message, type = 'error') {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

// Handle Login Form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('login-btn');
        
        // Disable button during submission
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Save token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                showMessage('success-message', 'Login successful! Redirecting...', 'success');
                
                // Redirect to shop page
                setTimeout(() => {
                    window.location.href = 'shop.html';
                }, 1000);
            } else {
                showMessage('error-message', data.message || 'Login failed');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('error-message', 'Network error. Please try again.');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });
}

// Handle Registration Form
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const role = document.getElementById('role').value;
        const registerBtn = document.getElementById('register-btn');
        
        // Validate password match
        if (password !== confirmPassword) {
            showMessage('error-message', 'Passwords do not match');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            showMessage('error-message', 'Password must be at least 6 characters');
            return;
        }
        
        // Disable button during submission
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating Account...';
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Save token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                showMessage('success-message', 'Registration successful! Redirecting...', 'success');
                
                // Redirect to shop page
                setTimeout(() => {
                    window.location.href = 'shop.html';
                }, 1000);
            } else {
                showMessage('error-message', data.message || 'Registration failed');
                registerBtn.disabled = false;
                registerBtn.textContent = 'Create Account';
            }
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('error-message', 'Network error. Please try again.');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
        }
    });
}

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname;
    
    if (token && (currentPage.includes('login.html') || currentPage.includes('register.html'))) {
        // User is logged in and on auth page, redirect to shop
        window.location.href = 'shop.html';
    }
}

// Run auth check on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuth);
} else {
    checkAuth();
}
