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
    alert(`Welcome back, ${user.email}!`);
    window.location.href = "/html/launchingPage.html"; // Adjust redirect as needed
  } catch (error) {
    console.error("Login error:", error.message);

    // Handle specific error codes (optional)
    switch (error.code) {
      case "auth/user-not-found":
        alert("No user found with this email.");
        break;
      case "auth/wrong-password":
        alert("Incorrect password. Please try again.");
        break;
      default:
        alert("An error occurred during login. Please try again.");
        document.getElementById("forgot-password-link").style.display = "block";
        break;
    }
  }
}
