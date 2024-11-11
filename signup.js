function handleSignup(event) {
  event.preventDefault();
  const username = document.getElementById("UserName").value;
  const firstName = document.getElementById("FirstName").value;
  const lastName = document.getElementById("LastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirmation = document.getElementById(
    "passwordConfirmation"
  ).value;

  if (
    username == "" ||
    firstName == "" ||
    lastName == "" ||
    email == "" ||
    password == "" ||
    passwordConfirmation === ""
  ) {
    alert("Please fill in all the fields.");
  } else if (password !== passwordConfirmation) {
    alert("Passwords do not match!");
  } else {
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    alert(`Sign up successful!\nWelcome, ${firstName} ${lastName}!`);
    window.location.href = "launchingPage.html";
  }
}

function unique(){
  const username = document.getElementById("UserName").value;

}
