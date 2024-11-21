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

      } else {
        button.innerHTML = "";
      }
    });
});

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




document.getElementById("save").addEventListener("click", async function () {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0]; // Extract the file from the input

  if (!file) {
    console.error("No file selected.");
    alert("Please select a file before saving.");
    return;
  }


  // Prepare FormData
  const currentUID = await getCurrentUserUID();
  console.log("Currrent UID: ", currentUID);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("uid", currentUID); // Replace with dynamic user UID
  formData.append("result", "Random Text For Now"); // Replace with actual result string

  // Send the FormData to the backend
  try {
    const response = await fetch(
      `https://wheatdiseasedetector.onrender.com/api/requests/createRequest`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    if (response.ok) {
      console.log("File uploaded successfully:", result.fileURL);
    } else {
      console.error("Error uploading file:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
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