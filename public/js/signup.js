if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); 
  console.log("app does not exist in log in, creating another one");
} else {
  firebase.app(); 
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
    passwordInput.type = "text"; 
    togglePassword1.classList.remove("fa-eye");
    togglePassword1.classList.add("fa-eye-slash"); 
  } else {
    passwordInput.type = "password"; 
    togglePassword1.classList.remove("fa-eye-slash");
    togglePassword1.classList.add("fa-eye");
  }

});

togglePassword2.addEventListener("click", () => {
  const currentType = passwordInputConf.type;
  if (currentType === "password") {
    passwordInputConf.type = "text"; 
    togglePassword2.classList.remove("fa-eye");
    togglePassword2.classList.add("fa-eye-slash"); 
  } else {
    passwordInputConf.type = "password"; 
    togglePassword2.classList.remove("fa-eye-slash");
    togglePassword2.classList.add("fa-eye"); 
  }
});


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


async function handleSignup(event) {
  event.preventDefault();

  const userName = userNameInput.value.trim();
  const firstName = document.getElementById("FirstName").value;
  const lastName = document.getElementById("LastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirmation = document.getElementById("passwordConfirmation").value;


  if (password !== passwordConfirmation) {
    alert("Passwords do not match!");
    return;
  }

  if (!passwordCriteria.test(password)) {
    alert("Your password must be at least 8 characters long and include at least one letter, one number, and one special character.");
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);

    // Send a verification email
    await userCredential.user.sendEmailVerification();
    alert("Signup successful! Please verify your email.");
    const uid = userCredential.user.uid;

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


// document.getElementById("signup-form").addEventListener("submit", handleSignup);
// document.getElementById("reset-password").addEventListener("click", handlePasswordReset);