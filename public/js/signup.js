if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); 
  console.log("app does not exist in log in, creating another one");// Initialize Firebase with your config
} else {
  firebase.app(); // Use the default app if already initialized
}

const auth = firebase.auth();

const userNameInput = document.getElementById("UserName");
const emailInput = document.getElementById("email");
const usernameFeedback = document.getElementById("usernameFeedback");
const passwordFeedback = document.getElementById("passwordFeedback");
const emailFeedback = document.getElementById("emailFeedback");
const passwordCriteria = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordInput = document.getElementById("password"); 
const passwordInputConf = document.getElementById("passwordConfirmation"); 
const togglePassword1 = document.getElementById("togglePassword1");
const togglePassword2 = document.getElementById("togglePassword2");


togglePassword1.addEventListener("click", () => {
  const currentType = passwordInput.type;
  if (currentType === "password") {
    passwordInput.type = "text"; // Show password
    togglePassword1.classList.remove("fa-eye");
    togglePassword1.classList.add("fa-eye-slash"); // Change to "eye-slash"
  } else {
    passwordInput.type = "password"; // Hide password
    togglePassword1.classList.remove("fa-eye-slash");
    togglePassword1.classList.add("fa-eye"); // Change to "eye"
  }

});

togglePassword2.addEventListener("click", () => {
  const currentType = passwordInputConf.type;
  if (currentType === "password") {
    passwordInputConf.type = "text"; // Show password
    togglePassword2.classList.remove("fa-eye");
    togglePassword2.classList.add("fa-eye-slash"); // Change to "eye-slash"
  } else {
    passwordInputConf.type = "password"; // Hide password
    togglePassword2.classList.remove("fa-eye-slash");
    togglePassword2.classList.add("fa-eye"); // Change to "eye"
  }
});

// Password validation function
function validatePassword() {
  const password = passwordInput.value;

  if (passwordCriteria.test(password)) {
    passwordFeedback.textContent = "Password is strong! Includes at least 8 characters (a letter, a number, and a special character).";
    passwordFeedback.style.color = "green";
  } else {
    passwordFeedback.textContent = "Password must be at least 8 characters long, include a letter, a number, and a special character.";
    passwordFeedback.style.color = "red";
  }
}

passwordInput.addEventListener("input", validatePassword);

/*let debounceTimeout1;
userNameInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout1);
  usernameFeedback.textContent = ""; // Reset feedback

  debounceTimeout1 = setTimeout(async () => {
    const userName = userNameInput.value.trim();
    if (userName) {
      try {
        // Make an API call to check username availability
        const response = await fetch(`http://localhost:3000/api/users/checkUsername/${userName}`);
        const data = await response.json();

        // Update feedback based on availability
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

let debounceTimeout2;
emailInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout2);
  emailFeedback.textContent = ""; // Reset feedback

  debounceTimeout2 = setTimeout(async () => {
    const email = emailInput.value.trim();
    if (email) {
      try {
        // Make an API call to check username availability
        const response = await fetch(`http://localhost:3000/api/users/checkEmail/${email}`);
        const data = await response.json();

        // Update feedback based on availability
        if (!data.available) {
          emailFeedback.textContent = 'Email is already registered. Please use another email or ';

          const loginLink = document.createElement("a");
          loginLink.href = "/public/html/login.html";
          loginLink.textContent = "proceed to Log In.";
          loginLink.style.color = "red";
          loginLink.style.fontWeight = "bold";
          loginLink.style.textDecoration = "underline";

          // Append the link to emailFeedback
          emailFeedback.appendChild(loginLink);

          emailFeedback.style.color = "red";
        } 
      } catch (error) {
        console.error("Error checking email:", error);
      }
    }
  }, 300); // Adjust delay time as needed
}); */




async function handleSignup(event) {
  event.preventDefault();

  const userName = userNameInput.value.trim();
  const firstName = document.getElementById("FirstName").value;
  const lastName = document.getElementById("LastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirmation = document.getElementById("passwordConfirmation").value;

  // Basic validation
  if (password !== passwordConfirmation) {
    alert("Passwords do not match!");
    return;
  }

  if (!passwordCriteria.test(password)) {
    alert("Your password must be at least 8 characters long and include at least one letter, one number, and one special character.");
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);

    // Send a verification email
    await userCredential.user.sendEmailVerification();
    alert("Signup successful! Please verify your email.");
    const uid = userCredential.user.uid; // Get UID from Firebase Authentication

    // Send the additional user info to your backend to store in Firestore
    const response = await fetch(`https://wheatdiseasedetector.onrender.com/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        userName,
        firstName,
        lastName,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to store user information in Firestore");
    }

    const data = await response.json();
    console.log(data.message);

    window.location.href = "../html/launchingPage.html";

  } catch (error) {
    console.error(error.message);
    alert(`Error: ${error.message}`);
  }
}

// Password reset function
async function handlePasswordReset(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;

  try {
    await sendPasswordResetEmail(auth, email);
    alert(`Password reset email sent to ${email}.`);
  } catch (error) {
    console.error("Error during password reset:", error.message);
    alert(`Error: ${error.message}`);
  }
}

// Attach event listeners
// document.getElementById("signup-form").addEventListener("submit", handleSignup);
// document.getElementById("reset-password").addEventListener("click", handlePasswordReset);