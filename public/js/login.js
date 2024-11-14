async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("UserName").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // Check for user by username, then email if not found
    let userResponse = await fetch(`http://localhost:3000/api/users/getUserByUsername/${username}`);
    if (userResponse.status === 404) {
      const emailLocal = username;
      userResponse = await fetch(`http://localhost:3000/api/users/getUserByEmail/${emailLocal}`);
    }
    const user = await userResponse.json();

    if (userResponse.ok) {
      const validateResponse = await fetch('http://localhost:3000/api/users/validatePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: user.user_name, password })
      });
      const { correct } = await validateResponse.json();

      if (correct) {
        alert(`Login successful! Welcome, ${user.user_name}!`);
        window.location.href = "/public/html/launchingPage.html";
      } else {
        alert("Incorrect password.");
      }
    } else {
      alert("User not found.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again later.");
  }
}
