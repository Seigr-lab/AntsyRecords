async function fetchBandcampReleases() {
    console.log("🎵 Loading Bandcamp releases from JSON...");

    let catalogContainer = document.getElementById("music-catalog");
    if (!catalogContainer) {
        console.error("❌ Music catalog container not found! Retrying...");
        setTimeout(fetchBandcampReleases, 500);
        return;
    }

    // ✅ Clear previous content
    catalogContainer.innerHTML = "";
    catalogContainer.classList.add("music-catalog-container");

    try {
        let response = await fetch("js/releases.json");
        let releases = await response.json();

        if (!Array.isArray(releases) || releases.length === 0) {
            console.warn("⚠️ No releases found in JSON.");
            catalogContainer.innerHTML = `<p style="color: yellow;">No releases available.</p>`;
            return;
        }

        console.log("✅ Loaded Releases:", releases);

        let usedPositions = [];
        let catalogWidth = catalogContainer.clientWidth;
        let catalogHeight = catalogContainer.clientHeight;
        let iconSize = 110;
        let padding = 20;
        let maxAttempts = 50;

        releases.forEach(release => {
            let item = document.createElement("div");
            item.classList.add("icon");
            item.setAttribute("data-album-id", release.albumId);
            item.setAttribute("data-artist", release.artist);
            item.setAttribute("data-title", release.title);
            item.setAttribute("draggable", "true");

            item.innerHTML = `
                <img src="${release.cover}" alt="${release.title}">
                <span>${release.artist} - ${release.title}</span>
            `;

            // ✅ Ensure proper spacing & avoid overlap
            let left, top, attempts = 0;
            let positionFound = false;

            while (!positionFound && attempts < maxAttempts) {
                left = Math.floor(Math.random() * (catalogWidth - iconSize - padding));
                top = Math.floor(Math.random() * (catalogHeight - iconSize - padding));

                if (!usedPositions.some(pos =>
                    Math.abs(pos.left - left) < iconSize + padding &&
                    Math.abs(pos.top - top) < iconSize + padding
                )) {
                    positionFound = true;
                    usedPositions.push({ left, top });
                }
                attempts++;
            }

            item.style.left = `${left}px`;
            item.style.top = `${top}px`;

            // ✅ Attach double-click event to open the music player window
            item.addEventListener("dblclick", () => 
                openPlayerWindow(release.albumId, release.title, release.artist)
            );

            catalogContainer.appendChild(item);
        });

        // ✅ Adjust the catalog window size dynamically
        adjustCatalogWindowSize();

    } catch (error) {
        console.error("❌ Error loading Bandcamp releases:", error);
        catalogContainer.innerHTML = `<p style="color:red;">Failed to load releases.</p>`;
    }
}

function adjustCatalogWindowSize() {
    let catalogWindow = document.getElementById("music-catalog-window");
    let catalogContainer = document.getElementById("music-catalog");

    if (!catalogWindow || !catalogContainer) return;

    let contentHeight = catalogContainer.scrollHeight + 50;
    let contentWidth = catalogContainer.scrollWidth + 50;

    catalogWindow.style.height = `${Math.min(window.innerHeight * 0.8, contentHeight)}px`;
    catalogWindow.style.width = `${Math.min(window.innerWidth * 0.8, contentWidth)}px`;
}

// ✅ Ensure script loads when the page is ready
document.addEventListener("DOMContentLoaded", fetchBandcampReleases);
