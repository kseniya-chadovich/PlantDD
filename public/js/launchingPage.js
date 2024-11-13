function displayUserInfo() {
  const username = localStorage.getItem("Username");

  document.getElementById(
      "welcome-text"
    ).textContent = `Welcome, ${username}!`; 
  
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
      const preview = document.getElementById("image-preview");
      const placeholder = document.getElementById("placeholder-text");

      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          preview.innerHTML = `<img src="${e.target.result}" alt="Image Preview" />`;
          placeholder.style.display = "none";
        };
        reader.readAsDataURL(file);
      } else {
        preview.innerHTML = "";
        placeholder.style.display = "block";
      }
    });
});

function logout() {
  localStorage.clear();
  window.location.href = "/public/html/login.html";
}