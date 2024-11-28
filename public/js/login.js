if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); 
  console.log("app does not exist in log in, creating another one");
} else {
  firebase.app(); 
}

const auth = firebase.auth();

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

    const user = userCredential.user;
    if (!user.emailVerified) {
      alert("Please verify your email before logging in.");
      return;
    }

    alert(`Welcome back!`);
    window.location.href = "/html/launchingPage.html"; 
  } catch (error) {
    console.error("Login error:", error.message);

    document.getElementById("forgot-password-link").style.display = "block";
    
  }
}

async function handleForgotPassword() {
  const email = document.getElementById("email").value; 


  try {
    console.log("Got to the handleForgotPassword");
    await auth.sendPasswordResetEmail(email, {
      url: "https://wheatplant-ea05f.web.app/html/passwordReset.html", 
      handleCodeInApp: true, 
    });
    window.location.href = "../html/varifyEmail.html";
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    alert("Failed to send password reset email. Please try again.");
  }
}

