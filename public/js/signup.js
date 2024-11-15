// Import necessary Firebase modules
import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// DOM elements
const signupForm = document.getElementById("signup-form");
const userNameInput = document.getElementById("UserName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordInputConf = document.getElementById("passwordConfirmation");
const togglePassword1 = document.getElementById("togglePassword1");
const togglePassword2 = document.getElementById("togglePassword2");
const usernameFeedback = document.getElementById("usernameFeedback");
const emailFeedback = document.getElementById("emailFeedback");
const passwordFeedback = document.getElementById("passwordFeedback");
const passwordCriteria = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Helper Function: Toggle Password Visibility
function togglePasswordVisibility(inputField, toggleIcon) {
  const currentType = passwordInput.type;
  if (currentType === "password") {
    passwordInput.type = "text"; // Show password
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    inputField.type = "password"; // Hide password
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

// Event listeners for toggling password visibility
togglePassword1.addEventListener("click", () => togglePasswordVisibility(passwordInput, togglePassword1));
togglePassword2.addEventListener("click", () => togglePasswordVisibility(passwordInputConf, togglePassword2));

// Helper Function: Validate Password
function validatePassword() {
  const password = passwordInput.value;

  if (passwordCriteria.test(password)) {
    passwordFeedback.textContent =
      "Password is strong! Includes at least 8 characters (a letter, a number, and a special character).";
    passwordFeedback.style.color = "green";
  } else {
    passwordFeedback.textContent =
      "Password must be at least 8 characters long, include a letter, a number, and a special character.";
    passwordFeedback.style.color = "red";
  }
}

passwordInput.addEventListener("input", validatePassword);

// Debounced Username Availability Check
let debounceTimeout1;
userNameInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout1);
  usernameFeedback.textContent = ""; // Reset feedback

  debounceTimeout1 = setTimeout(async () => {
    const userName = userNameInput.value.trim();
    if (userName) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/checkUsername/${userName}`);
        const data = await response.json();

        if (data.available) {
          usernameFeedback.textContent = "Username is available!";
          usernameFeedback.style.color = "green";
        } else {
          usernameFeedback.textContent = "Username is taken. Try another one.";
          usernameFeedback.style.color = "red";
        }
      } catch (error) {
        console.error("Error checking username:", error);
      }
    }
  }, 300); // Adjust delay time as needed
});

// Debounced Email Availability Check
let debounceTimeout2;
emailInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout2);
  emailFeedback.textContent = ""; // Reset feedback

  debounceTimeout2 = setTimeout(async () => {
    const email = emailInput.value.trim();
    if (email) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/checkEmail/${email}`);
        const data = await response.json();

        if (!data.available) {
          emailFeedback.textContent = 'Email is already registered. Please use another email or ';

          const loginLink = document.createElement("a");
          loginLink.href = "/html/login.html";
          loginLink.textContent = "proceed to Log In.";
          loginLink.style.color = "red";
          loginLink.style.fontWeight = "bold";
          loginLink.style.textDecoration = "underline";

          emailFeedback.appendChild(loginLink);
          emailFeedback.style.color = "red";
        }
      } catch (error) {
        console.error("Error checking email:", error);
      }
    }
  }, 300);
});

// Signup Function
async function handleSignup(event) {
  event.preventDefault();

  const userName = userNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const passwordConfirmation = passwordInputConf.value.trim();

  if (password !== passwordConfirmation) {
    alert("Passwords do not match!");
    return;
  }

  if (usernameFeedback.textContent === "Username is taken. Try another one.") {
    alert("Please choose a different username.");
    return;
  }

  if (!passwordCriteria.test(password)) {
    alert(
      "Your password must be at least 8 characters long and include at least one letter, one number, and one special character."
    );
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);
    alert("Signup successful! Please verify your email to complete registration.");
    signupForm.reset(); // Reset form
    window.location.href = "/html/launchingPage.html";
  } catch (error) {
    console.error("Signup error:", error);
    alert("An error occurred during signup. Please try again.");
  }
}

// Password Reset Function
async function handlePasswordReset() {
  const email = emailInput.value.trim();
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent. Please check your inbox.");
  } catch (error) {
    console.error("Password reset error:", error);
    alert("An error occurred while sending the password reset email. Please try again.");
  }
}

// Attach Signup Event Listener
signupForm.addEventListener("submit", handleSignup);

// Attach Password Reset Button Listener (if applicable)
document.getElementById("resetPasswordButton")?.addEventListener("click", handlePasswordReset);
