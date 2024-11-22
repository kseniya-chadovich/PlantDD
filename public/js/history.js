if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); 
  console.log("app does not exist in history, creating another one");// Initialize Firebase with your config
} else {
  firebase.app(); // Use the default app if already initialized
}
const auth = firebase.auth();

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
    sidebar.style.left = "-280px";
    mainBody.style.marginLeft = "50px";
  } else {
    sidebar.style.left = "0px";
    mainBody.style.marginLeft = "300px";
  }
}