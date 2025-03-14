// ✅ aboutWindow.js - Manages About Page Content
console.log("ℹ️ About Window Manager Loaded");

// ✅ Maximum Retry Count for Fetching the About Page
const MAX_RETRIES = 3;
let retryCount = 0;

// ✅ Load About Page Content
function loadAboutContent(contentDiv) {
    if (!contentDiv) {
        console.error("❌ About content container is missing!");
        return;
    }

    // ✅ Prevents unnecessary re-fetching if content is already loaded
    if (contentDiv.dataset.loaded === "true") {
        console.log("ℹ️ About page already loaded. Skipping fetch.");
        return;
    }

    function fetchAboutPage() {
        fetch("windows/about.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                if (!html.trim()) {
                    contentDiv.innerHTML = `<p style="color: yellow;">⚠️ About page is currently empty.</p>`;
                } else {
                    contentDiv.innerHTML = html;
                    contentDiv.dataset.loaded = "true"; // ✅ Mark as loaded
                }
            })
            .catch(error => {
                retryCount++;
                console.error(`❌ Failed to load About page (Attempt ${retryCount}/${MAX_RETRIES}): ${error.message}`);

                if (retryCount < MAX_RETRIES) {
                    console.warn(`🔄 Retrying in 2 seconds...`);
                    setTimeout(fetchAboutPage, 2000);
                } else {
                    contentDiv.innerHTML = `<p style="color:red;">❌ Failed to load about page after multiple attempts.</p>`;
                }
            });
    }

    fetchAboutPage();
}

// ✅ Ensure Global Access for Legacy Scripts
if (typeof window !== "undefined") {
    window.loadAboutContent = loadAboutContent;
}

// ✅ Export `loadAboutContent` ONLY ONCE
export { loadAboutContent };
