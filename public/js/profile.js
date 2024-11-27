if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); 
  console.log("app does not exist in profile, creating another one");
} else {
  firebase.app(); 
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

      
      const data = await getUserInfo(uid);
      console.log("userName:", data.userName);

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
        profileImage.src = data.profileImageUrl; 
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


const setSelectedFile = (file) => {
  selectedFile = file;
};


const uploadFile = (e) => {
  file = e.target.files[0];

  if (!file) {
    alert("Please select a file.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file); 
  reader.onloadend = () => {
    setFileName(file.name); 
    setSelectedFile(reader.result); 
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
      setFileName(""); 
      setSelectedFile(""); 
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

  firstNameInput.value = firstNameDisplay.innerText;
  lastNameInput.value = lastNameDisplay.innerText;
  userNameInput.value = userNameDisplay.innerText;

  
  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
}

async function saveChanges() {
  try {
    const uid = await getCurrentUserUID();

    if (!uid) {
      console.error("No user is signed in. Cannot save changes.");
      return;
    }

    await sendImageData(file);

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const userName = userNameInput.value;

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

    firstNameDisplay.innerText = firstName;
    lastNameDisplay.innerText = lastName;
    userNameDisplay.innerText = userName;

    firstNameDisplay.style.display = "inline";
    lastNameDisplay.style.display = "inline";
    userNameDisplay.style.display = "inline";

    firstNameInput.style.display = "none";
    lastNameInput.style.display = "none";
    userNameInput.style.display = "none";

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

  
  if (currentLeft === "0px") {
    sidebar.style.left = "-280px"; 
    mainBody.style.marginLeft = "50px"; 
  } else {
    sidebar.style.left = "0px"; 
    mainBody.style.marginLeft = "300px"; 
  }
}

function logout() {
  firebase.auth().signOut().then(() => {
    
    window.location.href = "../index.html";
  }).catch((error) => {
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
        profileImage.src = e.target.result; 
      };
      reader.readAsDataURL(file); 
      uploadFile(event);
    }
  };

  document
    .getElementById("image-upload")
    .addEventListener("change", imageUploadListener);
}

function disableImageUpload() {
  document.getElementById("upload-icon").style.display = "none";
  document
    .getElementById("image-upload")
    .removeEventListener("change", imageUploadListener);

}

