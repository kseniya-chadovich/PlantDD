const userNameInput = document.getElementById("UserName");
const usernameFeedback = document.getElementById("usernameFeedback");
const passwordFeedback = document.getElementById("passwordFeedback");
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
passwordInput.insertAdjacentElement("afterend", passwordFeedback);

let debounceTimeout;
userNameInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  usernameFeedback.textContent = ""; // Reset feedback

  debounceTimeout = setTimeout(async () => {
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

// Signup function
async function handleSignup(event) {
  event.preventDefault();

  // Collect form data
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

  // Check if the username feedback is still showing "taken"
  if (usernameFeedback.textContent === "Username is taken. Try another one.") {
    alert("Please choose a different username.");
    return;
  }

  // Check if the password meets the criteria
  if (!passwordCriteria.test(password)) {
    alert("Your password must be at least 8 characters long and include at least one letter, one number, and one special character.");
    return;
  }

  // Prepare request body
  const userData = {
    first_name: firstName,
    last_name: lastName,
    password,
    user_name: userName,
    email,
  };

  try {
    // Make API call to backend for signup
    const response = await fetch("http://localhost:3000/api/users/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Error in Signup: ${response.status} - ${response.statusText}`);
    }

    alert(`Sign up successful!\nWelcome, ${userName}!`);
    window.location.href = "/public/html/launchingPage.html";
  } catch (error) {
    console.error("Signup error:", error);
    alert("An error occurred during signup. Please try again.");
  }
}
