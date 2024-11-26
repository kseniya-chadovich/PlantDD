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

// Function to fetch the user's history
async function fetchUserHistory() { 
  try {
    const uid = await getCurrentUserUID();
    const response = await fetch(`https://wheatdiseasedetector.onrender.com/api/requests/getLinks/${uid}`); 
    const historyData = await response.json();

    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear any existing content

    if (!historyData.pairs || historyData.pairs.length === 0) {
      // Case: No saved items
      const noItemsMessage = document.createElement('p');
      noItemsMessage.textContent = "You have no saved items.";
      noItemsMessage.className = "no-items-message"; // Add a CSS class for styling
      historyList.appendChild(noItemsMessage);
    } else {
      // Case: User has saved items
      historyData.pairs.forEach((item) => {
        const historyItem = document.createElement('div');
        historyItem.className = "history-item";

        // Create image element
        const img = document.createElement('img');
        img.src = item.link; // Use the link retrieved from the backend
        img.alt = "Uploaded image"; // Alt text for accessibility
        img.onerror = () => {
          img.src = "/images/placeholder.png"; // Fallback if the image fails to load
        };
        historyItem.appendChild(img);

        // Create description paragraph
        const description = document.createElement('p');
        description.textContent = item.description || "No description available.";
        historyItem.appendChild(description);

        historyList.appendChild(historyItem);
      });
    }
  } catch (error) {
    console.error("Error fetching user history:", error);

    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '<p class="error-message">Failed to load your history. Please try again later.</p>';
  }
}

window.onload = function () {
  fetchUserHistory();
};

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


