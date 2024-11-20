function goHome() {
  window.location.href = "/html/launchingPage.html";
}

function logout() {
  window.location.href = "/html/login.html";
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const mainBody = document.querySelector(".main-content");
  const currentLeft = window.getComputedStyle(sidebar).left;

  if (currentLeft === "0px") {
    sidebar.style.left = "-250px";
    mainBody.style.marginLeft = "50px";
  } else {
    sidebar.style.left = "0px";
    mainBody.style.marginLeft = "300px";
  }
}