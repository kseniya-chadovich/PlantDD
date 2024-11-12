async function handleSignup(event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Collect form data
  const userName = document.getElementById("UserName").value;
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

  // Prepare request body
  const userData = {
    first_name: firstName,
    last_name: lastName,
    password,
    user_name: userName,
    email,
  };

  try {
    // Make API call to backend (adjust URL if backend is running on a different port)
    const response = await fetch("http://localhost:3000/api/users/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    // Check if response is okay
    if (!response.ok) {
      throw new Error(`Error in Sign up JS: ${response.status} - ${response.statusText}`);
    }

    // Parse JSON response
    const data = await response.json();
    alert(`Sign up successful!\nWelcome, ${data.first_name} ${data.last_name}!`);
    window.location.href = "/public/html/launchingPage.html"; // Redirect after successful signup
  } catch (error) {
    console.error("Signup error:", error);
    alert("An error occurred during signup. Please try again.");
  }
}
