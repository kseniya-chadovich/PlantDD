function displayUserInfo() {
  const username = localStorage.getItem("Username");

  document.getElementById("welcome-text").textContent = `Welcome, ${username}!`;
}

window.onload = function () {
  displayUserInfo();
};

document.getElementById("upload-btn").addEventListener("click", function () {
  document.getElementById("fileInput").click();

  document
    .getElementById("fileInput")
    .addEventListener("change", function (event) {
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