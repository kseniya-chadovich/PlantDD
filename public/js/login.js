if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); 
  console.log("app does not exist in log in, creating another one");// Initialize Firebase with your config
} else {
  firebase.app(); // Use the default app if already initialized
}

const auth = firebase.auth();

async function handleLogin(event) {
  event.preventDefault();

  // Collect form data
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Basic validation
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // Authenticate user with Firebase
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

    // Extract user information
    const user = userCredential.user;

    // Optional: Check if the user's email is verified
    if (!user.emailVerified) {
      alert("Please verify your email before logging in.");
      return;
    }

    // Successful login
    alert(`Welcome back!`);
    window.location.href = "/html/launchingPage.html"; // Adjust redirect as needed
  } catch (error) {
    console.error("Login error:", error.message);

    document.getElementById("forgot-password-link").style.display = "block";
    
  }
}

async function handleForgotPassword() {
  const email = document.getElementById("email").value; // Get the email input value


  try {
    console.log("Got to the handleForgotPassword");
    // Firebase function to send a password reset email
    await auth.sendPasswordResetEmail(email, {
      url: "https://wheatplant-ea05f.web.app/html/passwordReset.html", // Your custom reset page
      handleCodeInApp: true, // Ensures Firebase sends the action code
    });
    alert("Please check your email for the reset link.");
    window.location.href = "../html/varifyEmail.html";
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    alert("Failed to send password reset email. Please try again.");
  }
}

