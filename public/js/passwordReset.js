if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // Use the default app if already initialized
  }
  
  const auth = firebase.auth();
  
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get("oobCode"); // Firebase action code
  const mode = urlParams.get("mode"); // Should be "resetPassword"
  const apiKey = urlParams.get("apiKey");
  
  function handlePasswordReset(event) {
    event.preventDefault(); // Prevent form submission and page reload
  
    const newPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById("passwordConfirmation").value;
  
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
  
    if (mode === "resetPassword" && oobCode) {
      auth.confirmPasswordReset(oobCode, newPassword)
        .then(() => {
          alert("Password reset successfully! You can now log in.");
          window.location.href = "/html/login.html"; // Redirect to login page
        })
        .catch((error) => {
          console.error("Error resetting password:", error.message);
          alert("Failed to reset password. Please try again.");
        });
    } else {
      alert("Invalid or expired link. Please try again.");
      window.location.href = "/html/login.html"; // Redirect to login page
    }
  }
  
  // Toggle password visibility for password fields
  document.getElementById("togglePassword1").addEventListener("click", () => {
    const passwordField = document.getElementById("password");
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;
  });
  
  document.getElementById("togglePassword2").addEventListener("click", () => {
    const confirmPasswordField = document.getElementById("passwordConfirmation");
    const type = confirmPasswordField.type === "password" ? "text" : "password";
    confirmPasswordField.type = type;
  });
  