document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = document.getElementById('password');
    const submitButton = form.querySelector('input[type="submit"]');

    // Add password toggle functionality
    const passwordContainer = document.querySelector('.password-container');
    const toggleButton = document.createElement('i');
    toggleButton.className = 'fas fa-eye toggle-password';
    passwordContainer.appendChild(toggleButton);

    toggleButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'} toggle-password`;
    });

    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function showError(input, message) {
        const container = input.parentElement;
        let errorDiv = container.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            container.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        input.classList.add('error');
        input.classList.add('shake');
        
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);
    }

    function clearError(input) {
        const container = input.parentElement;
        const errorDiv = container.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        input.classList.remove('error');
    }

    // Real-time validation
    emailInput.addEventListener('input', function() {
        if (this.value) {
            if (!validateEmail(this.value)) {
                showError(this, 'Please enter a valid email address');
            } else {
                clearError(this);
            }
        } else {
            clearError(this);
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value) {
            if (!validatePassword(this.value)) {
                showError(this, 'Password must be at least 6 characters long');
            } else {
                clearError(this);
            }
        } else {
            clearError(this);
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        let isValid = true;

        // Validate email
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, 'Password must be at least 6 characters long');
            isValid = false;
        }

        if (isValid) {
            submitButton.classList.add('loading');
            
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new URLSearchParams(formData),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });

                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    const data = await response.json();
                    if (!data.success) {
                        throw new Error(data.message || 'Login failed');
                    }
                }
            } catch (error) {
                showError(emailInput, error.message || 'An error occurred. Please try again.');
            } finally {
                submitButton.classList.remove('loading');
            }
        }
    });

    // Add subtle animation on input focus
    const inputs = form.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});
