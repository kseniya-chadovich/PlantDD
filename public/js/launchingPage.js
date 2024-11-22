if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); 
  console.log("app does not exist in launching page, creating another one");// Initialize Firebase with your config
} else {
  firebase.app(); // Use the default app if already initialized
}

const auth = firebase.auth();
let statusOfLog = "notuser";

function displayUserInfoForEdit() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      statusOfLog = "user";
      console.log("User is signed in.");
      console.log("UID: ", user.uid)


      try {
        const data = await getUserInfo(user.uid); // Wait for the user data to resolve
        console.log("userName: ", data.userName);

        const username = data.userName || 'user!';  
        document.getElementById("welcome-text").textContent = `Welcome, ${username}!`;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.log("No user is signed in.");
    }
  });
}

window.onload = function () {
  displayUserInfoForEdit();
};

function logout() {
  localStorage.clear();
  window.location.href = "/html/login.html";
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const mainBody = document.querySelector(".main-body");
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








document.getElementById("upload-btn").addEventListener("click", function () {
  document.getElementById("fileInput").click();

  document
    .getElementById("fileInput")
    .addEventListener("change", async function (event) {
      const file = event.target.files[0];
      const button = document.getElementById("upload-btn");

      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          // Add the preview image inside the upload button
          button.innerHTML = `<img src="${e.target.result}" alt="Image Preview" />`;
        };
        reader.readAsDataURL(file);

        uploadFile(event);

      } else {
        button.innerHTML = "";
      }
    });
});



let fileName = ""; // Variable to hold the file name
let selectedFile = ""; // Variable to hold the base64-encoded file data

// Function to set the file name
const setFileName = (name) => {
  fileName = name;
};

// Function to set the selected file
const setSelectedFile = (file) => {
  selectedFile = file;
};

// Function to handle the file selection and encoding process
const uploadFile = (e) => {
  const file = e.target.files[0];

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
};

// Function to send the Base64 file data and file name to the backend
const sendImageData = async () => {
  try {
    if (!selectedFile) {
      alert("No file selected. Please upload a file before saving.");
      return;
    }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);

    const response = await fetch("https://wheatdiseasedetector.onrender.com/api/requests/uploadImage", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.msg === "SUCCESS") {
      console.log("File uploaded successfully:", result.pictureURL);
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

// Event listener for the "save" button
document.getElementById("save").addEventListener("click", async () => {
  await sendImageData(); // Call the function to send the image data
});

// Event listener for file input
document.getElementById("fileInput").addEventListener("change", (e) => {
  uploadFile(e); // Call the function to handle file selection
});







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