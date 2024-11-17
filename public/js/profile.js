// Grab elements from the HTML
const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");

const firstNameDisplay = document.getElementById("firstName-display");
const lastNameDisplay = document.getElementById("lastName-display");
const emailDisplay = document.getElementById("email-display");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");

// Function to switch to edit mode
function enableEditMode() {
  // Show input fields, hide display text
  firstNameDisplay.style.display = "none";
  lastNameDisplay.style.display = "none";
  emailDisplay.style.display = "none";

  firstNameInput.style.display = "inline-block";
  lastNameInput.style.display = "inline-block";
  emailInput.style.display = "inline-block";

  // Pre-fill input fields with current data
  firstNameInput.value = firstNameDisplay.innerText;
  lastNameInput.value = lastNameDisplay.innerText;
  emailInput.value = emailDisplay.innerText;

  // Toggle buttons
  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
}

// Function to save changes
function saveChanges() {
  // Save data and update display text
  firstNameDisplay.innerText = firstNameInput.value;
  lastNameDisplay.innerText = lastNameInput.value;
  emailDisplay.innerText = emailInput.value;

  // Switch back to view mode
  firstNameDisplay.style.display = "inline";
  lastNameDisplay.style.display = "inline";
  emailDisplay.style.display = "inline";

  firstNameInput.style.display = "none";
  lastNameInput.style.display = "none";
  emailInput.style.display = "none";

  // Toggle buttons
  editBtn.style.display = "inline-block";
  saveBtn.style.display = "none";
}

editBtn.addEventListener("click", enableEditMode);
saveBtn.addEventListener("click", saveChanges);

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const mainBody = document.querySelector(".main-content");
  const currentLeft = window.getComputedStyle(sidebar).left;

  // Toggle the sidebar visibility and move the main body accordingly
  if (currentLeft === "0px") {
    sidebar.style.left = "-250px"; // Hide sidebar
    mainBody.style.marginLeft = "50px"; // Reset main body margin
  } else {
    sidebar.style.left = "0px"; // Show sidebar
    mainBody.style.marginLeft = "300px"; // Push main body to the right (sidebar width + gap)
  }
}

function logout() {
  window.location.href = "../html/login.html";
}