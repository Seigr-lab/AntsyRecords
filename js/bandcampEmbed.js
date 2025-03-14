import { fetchBandcampReleases } from "./bandcampAPI.js";

const MAX_RETRIES = 5;
let retryCount = 0;

// ✅ Fetch and Display Bandcamp Releases
async function fetchAndDisplayReleases() {
    console.log("🎵 Loading Bandcamp releases via API...");

    let catalogContainer = document.getElementById("music-catalog");
    if (!catalogContainer) {
        console.error("❌ Music catalog container not found!");

        if (retryCount < MAX_RETRIES) {
            retryCount++;
            let delay = Math.pow(2, retryCount) * 500; // ✅ Exponential Backoff (500ms, 1s, 2s, 4s, etc.)
            console.warn(`🔄 Retrying in ${delay / 1000}s... (${retryCount}/${MAX_RETRIES})`);
            setTimeout(fetchAndDisplayReleases, delay);
        } else {
            console.error("❌ Max retries reached. Stopping fetch attempts.");
        }
        return;
    }

    catalogContainer.innerHTML = `<p style="color: white;">Loading releases...</p>`;
    catalogContainer.classList.add("music-catalog-container");

    try {
        let releases = await fetchBandcampReleases();

        if (!Array.isArray(releases) || releases.length === 0) {
            console.warn("⚠️ No releases found.");
            catalogContainer.innerHTML = `<p style="color: yellow;">No releases available.</p>`;
            return;
        }

        console.log("✅ Loaded Releases:", releases);
        catalogContainer.innerHTML = ""; // ✅ Clear previous content before appending

        releases.forEach(release => {
            let item = document.createElement("div");
            item.classList.add("icon");
            item.setAttribute("data-album-id", release.albumId);
            item.setAttribute("data-artist", release.artist);
            item.setAttribute("data-title", release.title);
            item.setAttribute("draggable", "true"); // ✅ Ensures all icons are draggable

            let coverImage = release.cover || "icons/default-cover.png";

            item.innerHTML = `
                <img src="${coverImage}" alt="${release.title}">
                <span>${release.artist} - ${release.title}</span>
            `;

            // ✅ Verify `window.openPlayerWindow` exists before using it
            if (typeof window.openPlayerWindow === "function") {
                item.addEventListener("dblclick", () => {
                    console.log(`🎵 Opening player for album: ${release.title}`);
                    window.openPlayerWindow(release.albumId, release.title, release.artist);
                });
            } else {
                console.error("❌ openPlayerWindow() is not defined! Ensure playerWindow.js is loaded.");
            }

            catalogContainer.appendChild(item);
        });

        // ✅ Ensure the catalog window is resized properly
        if (typeof window.adjustCatalogWindowSize === "function") {
            console.log("📏 Adjusting catalog window size...");
            window.adjustCatalogWindowSize();
        } else {
            console.warn("⚠️ adjustCatalogWindowSize() is not defined. Ensure catalogWindow.js is loaded.");
        }
    } catch (error) {
        console.error("❌ Error loading Bandcamp releases:", error);
        catalogContainer.innerHTML = `<p style="color:red;">Failed to load releases.</p>`;
    }
}

// ✅ Ensure function is globally accessible
window.fetchAndDisplayReleases = fetchAndDisplayReleases;
