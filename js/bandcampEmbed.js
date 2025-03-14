async function fetchBandcampReleases() {
    console.log("🎵 Loading Bandcamp releases via API...");

    let catalogContainer = document.getElementById("music-catalog");
    if (!catalogContainer) {
        console.error("❌ Music catalog container not found! Retrying...");
        setTimeout(fetchBandcampReleases, 500);
        return;
    }

    catalogContainer.innerHTML = "";
    catalogContainer.classList.add("music-catalog-container");

    try {
        let response = await fetch("js/releases.json");
        let releases = await response.json();

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

            item.innerHTML = `
                <img src="${release.cover}" alt="${release.title}">
                <span>${release.artist} - ${release.title}</span>
            `;

            item.addEventListener("dblclick", () =>
                openPlayerWindow(release.albumId, release.title, release.artist)
            );

            catalogContainer.appendChild(item);
        });

        adjustCatalogWindowSize();
    } catch (error) {
        console.error("❌ Error loading Bandcamp releases:", error);
        catalogContainer.innerHTML = `<p style="color:red;">Failed to load releases.</p>`;
    }
}

// ✅ Make function globally accessible
window.fetchBandcampReleases = fetchBandcampReleases;
