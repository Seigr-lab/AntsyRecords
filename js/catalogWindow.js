// ✅ catalogWindow.js - Manages Music Catalog Window
console.log("🎵 Catalog Window Manager Loaded");

import { fetchBandcampReleases } from "./bandcampAPI.js"; // ✅ Fetch Bandcamp Releases

// ✅ Prevent duplicate exports by ensuring SINGLE function declaration
export function loadCatalogContent(contentDiv) {
    console.log("📀 Loading music catalog...");

    if (!contentDiv) {
        console.error("❌ Content container not provided!");
        return;
    }

    contentDiv.innerHTML = `<p style="color: white;">Loading albums...</p>`;
    contentDiv.classList.add("catalog-grid");

    fetchBandcampReleases().then(albums => {
        if (!albums || albums.length === 0) {
            console.warn("⚠️ No albums found.");
            contentDiv.innerHTML = `<p style="color: red;">No albums found.</p>`;
            return;
        }

        contentDiv.innerHTML = ""; // ✅ Clear previous content

        albums.forEach(album => {
            let coverImage = album.cover || "icons/default-cover.png"; // ✅ Use fallback cover if missing

            // ✅ Create album container
            let albumItem = document.createElement("div");
            albumItem.classList.add("album-item");
            albumItem.setAttribute("data-album-id", album.albumId);
            albumItem.setAttribute("data-artist", album.artist);
            albumItem.setAttribute("data-title", album.title);

            // ✅ Create album image
            let albumCover = document.createElement("img");
            albumCover.src = coverImage;
            albumCover.alt = album.title;
            albumCover.classList.add("album-cover");
            albumCover.loading = "lazy";

            // ✅ Create album title
            let albumTitle = document.createElement("span");
            albumTitle.textContent = `${album.artist} - ${album.title}`;
            albumTitle.classList.add("album-title");

            // ✅ Append elements
            albumItem.appendChild(albumCover);
            albumItem.appendChild(albumTitle);
            contentDiv.appendChild(albumItem);
        });
    }).catch(error => {
        console.error("❌ Failed to load albums:", error);
        contentDiv.innerHTML = `<p style="color: red;">Failed to load albums. Retrying...</p>`;

        // ✅ Retry logic to attempt fetching again after a delay
        setTimeout(() => loadCatalogContent(contentDiv), 3000);
    });
}
