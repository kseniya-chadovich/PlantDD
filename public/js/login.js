async function handleLogin(event) {
  event.preventDefault(); // Prevent form submission

  const username = document.getElementById("UserName").value;
  const password = document.getElementById("password").value;

  if (username === "" || password === "") {
    alert("Please fill in all the fields.");
    return;
  }

  try {
    // Send the username/email and password to the backend for validation
    const response = await fetch('http://localhost:3000/api/users/validatePassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    // Handle the response from the backend
    if (result.status === 404) {
      alert(result.message);  // User not found
    } else if (result.status === 401) {
      alert(result.message);  
    } else if (result.status === 200) {
      alert(`Login successful!\nWelcome, ${username}!`);  // Login successful
      window.location.href = "/public/html/launchingPage.html"; // Redirect to another page
    } else {
      alert("An error occurred. Please try again later.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again later.");
  }
}
