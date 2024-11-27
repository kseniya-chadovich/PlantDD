if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  const auth = firebase.auth();

const passwordCriteria = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordInput = document.getElementById("password"); 
const passwordInputConf = document.getElementById("passwordConfirmation"); 
const togglePassword1 = document.getElementById("togglePassword1");
const togglePassword2 = document.getElementById("togglePassword2");
const passwordFeedback = document.getElementById("passwordFeedback");
  
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get("oobCode");
  const mode = urlParams.get("mode"); 
  const apiKey = urlParams.get("apiKey");
  
  function handlePasswordReset(event) {
    event.preventDefault(); 

    const newPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById("passwordConfirmation").value;
  
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    if (!passwordCriteria.test(newPassword)) {
      alert("Your password must be at least 8 characters long and include at least one letter, one number, and one special character.");
      return;
    }
  
    if (mode === "resetPassword" && oobCode) {
      auth.confirmPasswordReset(oobCode, newPassword)
        .then(() => {
          alert("Password reset successfully! You can now log in.");
          window.location.href = "/html/login.html"; 
        })
        .catch((error) => {
          console.error("Error resetting password:", error.message);
          alert("Failed to reset password. Please try again.");
        });
    } else {
      alert("Invalid or expired link. Please try again.");
    }
  }

  passwordInput.addEventListener("input", validatePassword);











  
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