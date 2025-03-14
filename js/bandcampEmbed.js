import { fetchBandcampReleases } from "./bandcampAPI.js";

const MAX_RETRIES = 5;
let retryCount = 0;

// ✅ Fetch and Display Bandcamp Releases
async function fetchAndDisplayReleases() {
    console.log("🎵 Loading Bandcamp releases via API...");

    let catalogContainer = document.getElementById("music-catalog");
    if (!catalogContainer) {
        console.error("❌ Music catalog container not found!");

        // ✅ Limit retries to prevent infinite loops
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.warn(`🔄 Retrying... (${retryCount}/${MAX_RETRIES})`);
            setTimeout(fetchAndDisplayReleases, 500);
        } else {
            console.error("❌ Max retries reached. Stopping fetch attempts.");
        }
        return;
    }

    catalogContainer.innerHTML = "";
    catalogContainer.classList.add("music-catalog-container");

    try {
        let releases = await fetchBandcampReleases(); // ✅ Use API instead of `releases.json`
        
        if (!Array.isArray(releases) || releases.length === 0) {
            console.warn("⚠️ No releases found.");
            catalogContainer.innerHTML = `<p style="color: yellow;">No releases available.</p>`;
            return;
        }

        console.log("✅ Loaded Releases:", releases);

        releases.forEach(release => {
            let item = document.createElement("div");
            item.classList.add("icon");
            item.setAttribute("data-album-id", release.albumId);
            item.setAttribute("data-artist", release.artist);
            item.setAttribute("data-title", release.title);
            item.setAttribute("draggable", "true");

            // ✅ Use a default image if no cover is available
            let coverImage = release.cover || "icons/default-cover.png";

            item.innerHTML = `
                <img src="${coverImage}" alt="${release.title}">
                <span>${release.artist} - ${release.title}</span>
            `;

            item.addEventListener("dblclick", () =>
                openPlayerWindow(release.albumId, release.title, release.artist)
            );

            catalogContainer.appendChild(item);
        });

        // ✅ Adjust window size safely
        if (typeof adjustCatalogWindowSize === "function") {
            adjustCatalogWindowSize();
        }
    } catch (error) {
        console.error("❌ Error loading Bandcamp releases:", error);
        catalogContainer.innerHTML = `<p style="color:red;">Failed to load releases.</p>`;
    }
}

// ✅ Make function globally accessible
window.fetchAndDisplayReleases = fetchAndDisplayReleases;
