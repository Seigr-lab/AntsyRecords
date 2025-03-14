// ✅ catalogWindow.js - Manages Music Catalog Window
console.log("🎵 Catalog Window Manager Loaded");

import { fetchBandcampReleases } from "./bandcampAPI.js";

// ✅ Load Music Catalog Content
export function loadCatalogContent(contentDiv) {
    contentDiv.innerHTML = `<p style="color: white;">Loading albums...</p>`;

    fetchBandcampReleases().then(albums => {
        if (!albums || albums.length === 0) {
            contentDiv.innerHTML = `<p style="color: red;">No albums found.</p>`;
            return;
        }

        contentDiv.innerHTML = albums.map(album => `
            <div class="album-item">
                <img src="${album.cover}" alt="${album.title}" class="album-cover">
                <div class="album-info">
                    <h3>${album.title}</h3>
                    <p>${album.artist}</p>
                    <button onclick="openPlayerWindow('${album.albumId}', '${album.title}', '${album.artist}')">Play</button>
                </div>
            </div>
        `).join("");
    }).catch(error => {
        console.error("❌ Failed to load albums:", error);
        contentDiv.innerHTML = `<p style="color: red;">Failed to load albums.</p>`;
    });
}
