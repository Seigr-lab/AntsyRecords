// ✅ aboutWindow.js - Manages About Page Content
console.log("ℹ️ About Window Manager Loaded");

// ✅ Maximum Retry Count for Fetching the About Page
const MAX_RETRIES = 3;
let retryCount = 0;

// ✅ Load About Page Content
export function loadAboutContent(contentDiv) {
    if (!contentDiv) {
        console.error("❌ About content container is missing!");
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
                }
            })
            .catch(error => {
                retryCount++;
                console.error(`❌ Error loading About page: ${error.message}`);

                if (retryCount < MAX_RETRIES) {
                    console.warn(`🔄 Retrying to load About page... (${retryCount}/${MAX_RETRIES})`);
                    setTimeout(fetchAboutPage, 2000);
                } else {
                    contentDiv.innerHTML = `<p style="color:red;">❌ Failed to load about page.</p>`;
                }
            });
    }

    fetchAboutPage();
}

// ✅ Ensure Function is Properly Exported
export { loadAboutContent };
