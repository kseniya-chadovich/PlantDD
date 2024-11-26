if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); 
  console.log("app does not exist in profile, creating another one");// Initialize Firebase with your config
} else {
  firebase.app(); // Use the default app if already initialized
}

let file;
let profileImageUrl;
let fileName = ""; 
let selectedFile = ""; 
const auth = firebase.auth();

const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");

const firstNameDisplay = document.getElementById("firstName-display");
const lastNameDisplay = document.getElementById("lastName-display");
const userNameDisplay = document.getElementById("userName-display");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const userNameInput = document.getElementById("userName");

async function displayUserInfo() {
  disableImageUpload();
  try {
    const uid = await getCurrentUserUID();

    if (uid) {
      console.log("User is signed in. UID:", uid);

      // Fetch user information
      const data = await getUserInfo(uid);
      console.log("userName:", data.userName);

      // Update UI
      firstNameDisplay.style.display = "inline";
      lastNameDisplay.style.display = "inline";
      userNameDisplay.style.display = "inline";

      firstNameInput.style.display = "none";
      lastNameInput.style.display = "none";
      userNameInput.style.display = "none";

      firstNameDisplay.innerText = data.firstName;
      lastNameDisplay.innerText = data.lastName;
      userNameDisplay.innerText = data.userName;

      const profileImage = document.getElementById('profile-image');
      if (data.profileImageUrl) {
        profileImage.src = data.profileImageUrl; // Use the stored URL
      }
    } else {
      console.log("No user is signed in.");
    }
  } catch (error) {
    console.error("Error displaying user info:", error);
  }
}

window.onload = function () {
  displayUserInfo();
};

const setFileName = (name) => {
  fileName = name;
};

// Function to set the selected file
const setSelectedFile = (file) => {
  selectedFile = file;
};

// Function to handle the file selection and encoding process
const uploadFile = (e) => {
  file = e.target.files[0];

  if (!file) {
    alert("Please select a file.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file); // Read the file as a Base64 data URL
  reader.onloadend = () => {
    setFileName(file.name); // Save the file name
    setSelectedFile(reader.result); // Save the Base64-encoded file data
  };
  console.log("Finished setting the name and the file!");
};

const sendImageData = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

  formData.append('fileName', file.name);

    const response = await fetch("https://wheatdiseasedetector.onrender.com/api/users/uploadProfilePicture", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.msg === "SUCCESS") {
      console.log("File uploaded successfully:", result.pictureURL);
      profileImageUrl = result.pictureURL;
      alert("Upload successful!");
      setFileName(""); // Reset the file name
      setSelectedFile(""); // Reset the selected file data
    } else {
      console.error("Upload failed:", result.error);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};



function enableEditMode() {
  
  enableImageUpload();

  firstNameDisplay.style.display = "none";
  lastNameDisplay.style.display = "none";
  userNameDisplay.style.display = "none";

  firstNameInput.style.display = "inline-block";
  lastNameInput.style.display = "inline-block";
  userNameInput.style.display = "inline-block";

  // Pre-fill input fields with current data
  firstNameInput.value = firstNameDisplay.innerText;
  lastNameInput.value = lastNameDisplay.innerText;
  userNameInput.value = userNameDisplay.innerText;

  // Toggle buttons
  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
}

async function saveChanges() {
  try {
    // Get the current user's UID
    const uid = await getCurrentUserUID();

    if (!uid) {
      console.error("No user is signed in. Cannot save changes.");
      return;
    }

    await sendImageData(file);

    // Prepare the updated user data
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const userName = userNameInput.value;

    // Make a PUT request to update the user info
    const response = await fetch(`https://wheatdiseasedetector.onrender.com/api/users/updateInfo/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        firstName,
        lastName,
        profileImageUrl,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Error updating user info: ", data.message);
      return;
    }

    console.log("User information updated successfully.");

    // Update the display text with the new values
    firstNameDisplay.innerText = firstName;
    lastNameDisplay.innerText = lastName;
    userNameDisplay.innerText = userName;

    // Switch back to view mode
    firstNameDisplay.style.display = "inline";
    lastNameDisplay.style.display = "inline";
    userNameDisplay.style.display = "inline";

    firstNameInput.style.display = "none";
    lastNameInput.style.display = "none";
    userNameInput.style.display = "none";

    // Toggle buttons
    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
  } catch (error) {
    console.error("Error saving changes:", error);
  }
  disableImageUpload();
}


editBtn.addEventListener("click", enableEditMode);
saveBtn.addEventListener("click", saveChanges);

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const mainBody = document.querySelector(".main-content");
  const currentLeft = window.getComputedStyle(sidebar).left;

  // Toggle the sidebar visibility and move the main body accordingly
  if (currentLeft === "0px") {
    sidebar.style.left = "-280px"; // Hide sidebar
    mainBody.style.marginLeft = "50px"; // Reset main body margin
  } else {
    sidebar.style.left = "0px"; // Show sidebar
    mainBody.style.marginLeft = "300px"; // Push main body to the right (sidebar width + gap)
  }
}

function logout() {
  firebase.auth().signOut().then(() => {
    // Redirect to the homepage after logging out
    window.location.href = "../index.html";
  }).catch((error) => {
    // Handle any errors that occur during sign-out
    console.error("Error during sign-out:", error);
  });
}

async function getUserInfo(uid){
  let userData;

  try {
    console.log("In the function getUserInfo");
    const response = await fetch(`https://wheatdiseasedetector.onrender.com/api/users/getInfo/${uid}`);

    if (!response.ok) {
      const data = await response.json();
      console.error("Error fetching user info: ", data.message);
      return;
    }

    userData = await response.json();
    console.log("User info:", userData);
    return userData;
  } catch (error) {
    console.error("Error:", error);
  }
}


function getCurrentUserUID() {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user.uid);
      } else {
        resolve(null);
      }
    });
  });
}

let imageUploadListener;
function enableImageUpload() {
  document.getElementById("upload-icon").style.display = "block";

  imageUploadListener = function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const profileImage = document.getElementById("profile-image");
        profileImage.src = e.target.result; // Set the uploaded image as the new profile picture
      };
      reader.readAsDataURL(file); 
      uploadFile(event);// Read the file as a Data URL
    }
  };

  // Enable the event listener for the file input
  document
    .getElementById("image-upload")
    .addEventListener("change", imageUploadListener);
}

function disableImageUpload() {
  document.getElementById("upload-icon").style.display = "none";
  // Disable the event listener for the file input
  document
    .getElementById("image-upload")
    .removeEventListener("change", imageUploadListener);

}

