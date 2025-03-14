// ✅ catalogWindow.js - Manages Music Catalog Window
console.log("🎵 Catalog Window Manager Loaded");

import { fetchBandcampReleases } from "./bandcampAPI.js";

// ✅ Load Music Catalog Content
function loadCatalogContent(contentDiv) {
    console.log("📀 Loading Music Catalog...");

    if (!contentDiv) {
        console.error("❌ Music catalog container missing!");
        return;
    }

    contentDiv.innerHTML = `<p style="color: white;">Loading albums...</p>`;
    contentDiv.classList.add("catalog-grid"); // ✅ Ensure grid structure

    fetchAlbums(contentDiv, 0);
}

// ✅ Attach to `window` for global access (Legacy Support)
if (typeof window !== "undefined") {
    window.loadCatalogContent = loadCatalogContent;
}

// ✅ Fetch albums with retry logic
function fetchAlbums(contentDiv, attempt) {
    fetchBandcampReleases().then(albums => {
        if (!albums || albums.length === 0) {
            contentDiv.innerHTML = `<p style="color: red;">⚠️ No albums found.</p>`;
            return;
        }

        contentDiv.innerHTML = ""; // ✅ Clear previous content
        let savedPositions = JSON.parse(localStorage.getItem("albumPositions")) || {};

        albums.forEach((album, index) => {
            let albumId = `album-${album.albumId}`;
            let coverImage = album.cover || "icons/default-cover.png"; 

            // ✅ Create album file icon
            let albumItem = document.createElement("div");
            albumItem.classList.add("icon", "album-item");
            albumItem.setAttribute("data-album-id", album.albumId);
            albumItem.setAttribute("data-title", album.title);
            albumItem.setAttribute("data-artist", album.artist);
            albumItem.setAttribute("draggable", "true");

            // ✅ Restore position if saved
            if (savedPositions[albumId]) {
                albumItem.style.left = `${savedPositions[albumId].x}px`;
                albumItem.style.top = `${savedPositions[albumId].y}px`;
            }

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

            // ✅ Attach event listeners
            albumItem.appendChild(albumCover);
            albumItem.appendChild(albumTitle);

            albumItem.addEventListener("dblclick", () => {
                console.log(`🎵 Opening Player for ${album.title}`);
                if (typeof window.openPlayerWindow === "function") {
                    window.openPlayerWindow(album.albumId);
                } else {
                    console.error("❌ openPlayerWindow() is not defined!");
                }
            });

            // ✅ Append album to container
            contentDiv.appendChild(albumItem);
        });

        enableDragDrop(contentDiv); // ✅ Enable drag & drop for album icons
    }).catch(error => {
        console.error(`❌ Failed to load albums (Attempt ${attempt + 1}):`, error);

        if (attempt < 2) {
            contentDiv.innerHTML = `<p style="color: red;">⚠️ Error loading albums. Retrying...</p>`;
            setTimeout(() => fetchAlbums(contentDiv, attempt + 1), 3000);
        } else {
            contentDiv.innerHTML = `<p style="color: red;">❌ Unable to load catalog after multiple attempts.</p>`;
        }
    });
}

// ✅ Drag & Drop Repositioning for Albums
function enableDragDrop(contentDiv) {
    let draggedItem = null;

    contentDiv.addEventListener("dragstart", (event) => {
        draggedItem = event.target.closest(".album-item");
        event.dataTransfer.effectAllowed = "move";
    });

    contentDiv.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    contentDiv.addEventListener("drop", (event) => {
        event.preventDefault();
        if (!draggedItem) return;

        let rect = contentDiv.getBoundingClientRect();
        let newX = event.clientX - rect.left - (draggedItem.offsetWidth / 2);
        let newY = event.clientY - rect.top - (draggedItem.offsetHeight / 2);

        draggedItem.style.left = `${Math.max(0, newX)}px`;
        draggedItem.style.top = `${Math.max(0, newY)}px`;

        let positions = JSON.parse(localStorage.getItem("albumPositions")) || {};
        positions[draggedItem.getAttribute("data-album-id")] = { x: newX, y: newY };
        localStorage.setItem("albumPositions", JSON.stringify(positions));

        draggedItem = null;
    });
}

// ✅ Export `loadCatalogContent` once
export { loadCatalogContent };
