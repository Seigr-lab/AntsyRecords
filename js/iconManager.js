function initializeIconManager() {
    console.log("✅ Icon Manager Loaded");

    document.querySelectorAll(".icon").forEach(icon => {
        icon.addEventListener("dblclick", (event) => {
            let file = icon.getAttribute("data-file");

            if (file === "AntsyRecords") {
                window.location.href = "http://antsy.seigr.net";
            } else if (file === "settings") {
                openWindow("settings", "Settings");
            } else if (file === "music-catalog") {
                openWindow("music-catalog", "Music Catalog");
            } else {
                openWindow(file, icon.querySelector("span").innerText);
            }
        });

        // ✅ Special handling for Bandcamp releases inside "Music Catalog"
        icon.addEventListener("dblclick", (event) => {
            let albumId = icon.getAttribute("data-album-id");
            if (albumId) {
                openWindow("music-player", "Music Player", albumId);
            }
        });
    });
}
