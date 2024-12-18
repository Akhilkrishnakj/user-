// Elements
const nameInput = document.getElementById('name');
const nameError = document.getElementById('name-message');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-message');
const mobileNumberInput = document.getElementById('mobileNumber');
const mobileError = document.getElementById('error-message');
const passwordInput = document.getElementById('password');
const passwordError = document.getElementById('password-error');
const form = document.getElementById('register-form');

// Regex patterns for validation
const namePattern = /^[A-Za-z\s]+$/; // Allows only letters and spaces
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
const mobileNumberPattern = /^\d{10}$/; // Exactly 10 digits
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,10}$/; // Password criteria: one uppercase, one lowercase, one digit, 6-10 characters

// Name Validation
nameInput.addEventListener('input', () => {
    if (namePattern.test(nameInput.value)) {
        nameError.style.display = 'none';
    } else {
        nameError.style.display = 'block'; 
    }
});

// Email Validation
emailInput.addEventListener('input', () => {
    if (emailPattern.test(emailInput.value)) {
        emailError.style.display = 'none';
    } else {
        emailError.style.display = 'block'; 
    }
});

// Mobile Number Validation
mobileNumberInput.addEventListener('input', () => {
    if (mobileNumberPattern.test(mobileNumberInput.value)) {
        mobileError.style.display = 'none';
    } else {
        mobileError.style.display = 'block';
    }
});

// Password Validation
passwordInput.addEventListener('input', () => {
    if (passwordPattern.test(passwordInput.value)) {
        passwordError.style.display = 'none';
    } else {
        passwordError.style.display = 'block';
    }
});

// Form Submission Validation
form.addEventListener('submit', (event) => {
    const isNameValid = namePattern.test(nameInput.value);
    const isEmailValid = emailPattern.test(emailInput.value);
    const isMobileValid = mobileNumberPattern.test(mobileNumberInput.value);
    const isPasswordValid = passwordPattern.test(passwordInput.value);

    // Block submission if any field is invalid
    if (!isNameValid || !isEmailValid || !isMobileValid || !isPasswordValid) {
        event.preventDefault(); // Prevent form submission
        alert("Please ensure all fields are filled out correctly");
    }
});