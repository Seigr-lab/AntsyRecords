import { fetchAlbumData } from "./bandcampAPI.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("🎵 Custom Player Window Manager Loaded");

    async function openPlayerWindow(albumId) {
        let existingWindow = document.getElementById("music-player-window");
        if (existingWindow) {
            bringWindowToFront(existingWindow);
            return;
        }

        let albumData = await fetchAlbumData(albumId);
        if (!albumData) {
            console.error("❌ Failed to load album data.");
            return;
        }

        let win = document.createElement("div");
        win.id = "music-player-window";
        win.classList.add("window", "player-window");

        let leftPos = Math.max(50, Math.min(100 + Math.random() * 300, window.innerWidth - 400));
        let topPos = Math.max(50, Math.min(100 + Math.random() * 200, window.innerHeight - 300));

        win.style.position = "absolute";
        win.style.left = `${leftPos}px`;
        win.style.top = `${topPos}px`;
        win.style.zIndex = "100";

        // ✅ Generate HTML for Custom Player
        win.innerHTML = `
            <div class="window-header">
                <span>${albumData.artist} - ${albumData.albumTitle}</span>
                <button class="close-btn">✖</button>
            </div>
            <div class="window-content player-content">
                <img src="${albumData.coverUrl}" alt="Album Cover" class="album-cover">
                <audio id="custom-audio-player" controls>
                    <source id="audio-source" src="${albumData.tracks[0].streamUrl}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <ul id="tracklist">
                    ${albumData.tracks.map((track, index) => `
                        <li class="track-item" data-url="${track.streamUrl}">
                            ${index + 1}. ${track.title}
                        </li>`).join("")}
                </ul>
            </div>
        `;

        document.getElementById("window-container").appendChild(win);

        bringWindowToFront(win);
        makeDraggable(win);
        makeResizable(win);

        win.querySelector(".close-btn").addEventListener("click", () => {
            closePlayerWindow();
        });

        setupTrackSelection(win);
    }

    function setupTrackSelection(win) {
        let tracklist = win.querySelectorAll(".track-item");
        let audioPlayer = win.querySelector("#custom-audio-player");
        let audioSource = win.querySelector("#audio-source");

        tracklist.forEach(track => {
            track.addEventListener("click", function () {
                let trackUrl = this.getAttribute("data-url");
                audioSource.src = trackUrl;
                audioPlayer.load();
                audioPlayer.play();
            });
        });
    }

    function closePlayerWindow() {
        let win = document.getElementById("music-player-window");
        if (win) win.remove();
    }

    function bringWindowToFront(win) {
        document.querySelectorAll(".window").forEach(w => w.style.zIndex = "10");
        win.style.zIndex = "200";
    }

    function makeDraggable(win) {
        let header = win.querySelector(".window-header");
        let shiftX, shiftY;
        let isDragging = false;

        function moveWindow(clientX, clientY) {
            let newLeft = Math.max(0, Math.min(clientX - shiftX, window.innerWidth - win.offsetWidth));
            let newTop = Math.max(0, Math.min(clientY - shiftY, window.innerHeight - win.offsetHeight));
            win.style.left = `${newLeft}px`;
            win.style.top = `${newTop}px`;
        }

        function startDrag(event) {
            event.preventDefault();
            isDragging = true;

            let clientX = event.touches ? event.touches[0].clientX : event.clientX;
            let clientY = event.touches ? event.touches[0].clientY : event.clientY;
            shiftX = clientX - win.getBoundingClientRect().left;
            shiftY = clientY - win.getBoundingClientRect().top;
            bringWindowToFront(win);

            document.addEventListener(event.type === "mousedown" ? "mousemove" : "touchmove", onMove);
            document.addEventListener(event.type === "mousedown" ? "mouseup" : "touchend", stopDrag, { once: true });
        }

        function onMove(event) {
            if (!isDragging) return;
            let clientX = event.touches ? event.touches[0].clientX : event.clientX;
            let clientY = event.touches ? event.touches[0].clientY : event.clientY;
            moveWindow(clientX, clientY);
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("touchmove", onMove);
        }

        header.addEventListener("mousedown", startDrag);
        header.addEventListener("touchstart", startDrag, { passive: true });

        header.style.cursor = "grab";
    }

    function makeResizable(win) {
        win.style.resize = "both";
        win.style.overflow = "auto";
    }

    window.openPlayerWindow = openPlayerWindow;
    window.closePlayerWindow = closePlayerWindow;
});
