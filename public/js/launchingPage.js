if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); 
  console.log("app does not exist in launching page, creating another one");// Initialize Firebase with your config
} else {
  firebase.app(); // Use the default app if already initialized
}

const auth = firebase.auth();
let statusOfLog = "notuser";

let file;
let link;
let fileName = ""; 
let selectedFile = ""; 
let uidLocal;

function displayUserInfoForEdit() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      statusOfLog = "user";
      console.log("User is signed in.");
      uidLocal = user.uid;
      console.log("UID: ", user.uid)
      document.getElementById("notuserButtons").style.display = "none";


      try {
        const data = await getUserInfo(user.uid); // Wait for the user data to resolve
        console.log("userName: ", data.userName);

        const username = data.userName || 'user!';  
        document.getElementById("welcome-text").textContent = `Welcome, ${username}!`;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      document.getElementById("save").style.display = "none";
      document.getElementById("logout").style.display = "none";
      document.getElementById("profile").style.display = "none";
      document.getElementById("history").style.display = "none";
      document.getElementById("notuserButtons").style.display = "flex";
      document.getElementById("notuserButtons").style.justifyContent = "center";

      document.getElementById("detect").style.display = 'flex';
      document.getElementById("detect").style.justifyContent = 'center'; 
      document.getElementById("welcome-text").textContent = `Welcome, user!`;
      console.log("No user is signed in.");
    }
  });
}

window.onload = function () {
  displayUserInfoForEdit();
};

function logout() {
  firebase.auth().signOut().then(() => {
    // Redirect to the homepage after logging out
    window.location.href = "../index.html";
  }).catch((error) => {
    // Handle any errors that occur during sign-out
    console.error("Error during sign-out:", error);
  });
  
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const mainBody = document.querySelector(".main-body");
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

// Function to send the Base64 file data and file name to the backend
const sendImageData = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

  formData.append('fileName', file.name);

    const response = await fetch("https://wheatdiseasedetector.onrender.com/api/requests/uploadImage", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.msg === "SUCCESS") {
      console.log("File uploaded successfully:", result.pictureURL);
      link = result.pictureURL;
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


const detectResult = async (file) => {
  if (!file) {
    alert("Please upload an image before clicking detect.");
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append("file", file); // Add the file selected by the user
    
    // Call the prediction API
    const response = await fetch("https://plantmodel.onrender.com/predict", {
        method: "POST",
        body: formData,
    });
  
    const data = await response.json();
  
    // Handle the response
    if (response.ok) {
      if (data.predicted_disease == "Healthy"){
        document.getElementById("answer").textContent = "None";
        document.getElementById("answer").style.color = "green";
      }
      else{
        document.getElementById("answer").textContent = data.predicted_disease;
      }
    } else {
        console.error("Detection failed:", data.error || "Unknown error");
        document.getElementById("answer").textContent = `Error: ${data.error}`;
    }
  } catch (error) {
    console.error("Error during detection:", error);
    document.getElementById("answer").textContent = `Error: ${error.message}`;
  }
};



// Event listener for the "save" button
document.getElementById("save").addEventListener("click", async () => {
  await sendImageData(file);
  await storeLink(uidLocal, link);
  document.getElementById("upload-btn").innerHTML = ""; // Call the function to send the image data
});

document.getElementById("detect").addEventListener("click", async () => {
  await detectResult(file);
  console.log("Detection done.");
});


const storeLink = async (id, link) => {
  const descriptionLocal = document.getElementById("answer").textContent;
  if (descriptionLocal === ""){
    console.log("no desc");
    return;
  }
  try {
    const response = await fetch("https://wheatdiseasedetector.onrender.com/api/requests/storeLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: id,
        link: link,
        description: descriptionLocal,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Link stored successfully! You can find it now in the History section of the application."); // Alert for success
    } else {
      alert(`Failed to store the link: ${result.message}`); // Alert for failure
    }
  } catch (error) {
    console.error("Error storing the link:", error);
  }
};



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