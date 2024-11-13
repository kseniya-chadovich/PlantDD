// history.js
async function getSearchHistory(userId) {
  try {
    const response = await fetch(`/api/search-history/${userId}`);
    const data = await response.json();

    const historyList = document.getElementById("history-list");
    historyList.innerHTML = ""; // Clear previous history

    data.forEach((entry) => {
      const historyItem = document.createElement("div");
      historyItem.classList.add("history-item");

      // Create the content for the history item
      const img = document.createElement("img");
      img.src = entry.image_url || "default-image.jpg"; // Fallback if no image URL is available
      img.alt = "Search Image";

      const details = document.createElement("div");
      details.classList.add("details");

      const searchTerm = document.createElement("div");
      searchTerm.classList.add("search-term");
      searchTerm.textContent = entry.search_term;

      const timestamp = document.createElement("div");
      timestamp.classList.add("timestamp");
      timestamp.textContent = new Date(entry.search_timestamp).toLocaleString();

      details.appendChild(searchTerm);
      details.appendChild(timestamp);

      // Append image and details to the history item
      historyItem.appendChild(img);
      historyItem.appendChild(details);

      // Append the history item to the list
      historyList.appendChild(historyItem);
    });
  } catch (error) {
    console.error("Error fetching search history:", error);
  }
}

// Example user ID (replace with actual logged-in user ID)
const userId = 1;
getSearchHistory(userId);


function goHome() {
  window.location.href = "/public/html/launchingPage.html"; // Adjust this based on your actual home page URL
}

function logout() {
  // Perform any necessary logout logic, such as clearing session data or tokens
  window.location.href = "/public/html/login.html"; // Redirecting to the login page
}