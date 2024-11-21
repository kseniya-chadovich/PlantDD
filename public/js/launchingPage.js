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
  const file = fileInput.files[0];

  if (!file) {
      alert("Please select a file before saving.");
      return;
  }

  // Image compression options
  const options = {
    maxSizeMB: 0.5,  // Max file size 0.5MB
    maxWidthOrHeight: 800,  // Max width/height
    useWebWorker: true,  // Use web worker for compression
    maxQuality: 0.6,  // Quality set to 60% of original
};

  try {
      // Compress the image using browser-image-compression
      const compressedFile = await imageCompression(file, options);

      // Convert the compressed image to a base64 string
      const reader = new FileReader();
      reader.onload = async function (e) {
          const base64ImageString = e.target.result;  // Base64 string
          const fileName = `${Date.now()}_${file.name}`;  // Unique file name based on timestamp

          try {
              // Send the base64-encoded image and file name to the backend
              const response = await fetch("https://wheatdiseasedetector.onrender.com/api/requests/uploadImage", {
                  method: "POST",
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      base64ImageString: base64ImageString,
                      fileName: fileName,
                  }),
              });

              const result = await response.json();

              if (response.ok && result.msg === 'SUCCESS') {
                  console.log("File uploaded successfully:", result.pictureURL);
                  // You can use result.pictureURL as needed here (e.g., display the image, store URL, etc.)
              } else {
                  console.error("Error uploading file:", result.error);
              }
          } catch (error) {
              console.error("Error from Firebase:", error);
          }
      };

      reader.readAsDataURL(compressedFile);  // Convert the compressed file to base64
  } catch (error) {
      console.error("Error compressing image:", error);
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