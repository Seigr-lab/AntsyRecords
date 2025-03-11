document.addEventListener("DOMContentLoaded", () => {
    console.log("🎵 Player Window Manager Loaded");

    function openPlayerWindow(albumId, albumTitle, artist) {
        let existingWindow = document.getElementById("music-player-window");
        if (existingWindow) {
            bringWindowToFront(existingWindow);
            return;
        }

        let win = document.createElement("div");
        win.id = "music-player-window";
        win.classList.add("window", "player-window");

        win.style.position = "absolute";
        win.style.left = `${Math.min(100 + Math.random() * 300, window.innerWidth - 320)}px`;
        win.style.top = `${Math.min(100 + Math.random() * 200, window.innerHeight - 250)}px`;
        win.style.zIndex = "100";

        win.innerHTML = `
            <div class="window-header">
                <span>${artist} - ${albumTitle}</span>
                <button class="close-btn">✖</button>
            </div>
            <div class="window-content player-content">
                <p style="color: red;">Loading player...</p>
            </div>
        `;

        document.getElementById("window-container").appendChild(win);

        bringWindowToFront(win);
        makeDraggable(win);
        makeResizable(win);

        win.querySelector(".close-btn").addEventListener("click", () => {
            closePlayerWindow();
        });

        embedBandcamp(win, albumId);
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

        function onMouseMove(event) {
            if (!isDragging) return;
            win.style.left = `${Math.max(0, Math.min(event.clientX - shiftX, window.innerWidth - win.offsetWidth))}px`;
            win.style.top = `${Math.max(0, Math.min(event.clientY - shiftY, window.innerHeight - win.offsetHeight))}px`;
        }

        header.addEventListener("mousedown", function(event) {
            event.preventDefault();
            isDragging = true;
            shiftX = event.clientX - win.getBoundingClientRect().left;
            shiftY = event.clientY - win.getBoundingClientRect().top;
            bringWindowToFront(win);

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", function() {
                isDragging = false;
                document.removeEventListener("mousemove", onMouseMove);
            }, { once: true });
        });

        header.style.cursor = "grab";
    }

    function makeResizable(win) {
        win.style.resize = "both";
        win.style.overflow = "auto";
    }

    function embedBandcamp(win, albumId) {
        let playerContainer = win.querySelector(".player-content");
        if (!playerContainer) return;

        let iframe = document.createElement("iframe");
        iframe.src = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=333333/linkcol=ffffff/artwork=small/transparent=true/`;
        iframe.style.width = "100%";
        iframe.style.height = "150px";
        iframe.style.border = "none";

        playerContainer.innerHTML = ""; // Clear previous content
        playerContainer.appendChild(iframe);

        // ✅ Adjust player window height dynamically
        win.style.width = "400px"; // Fixed width for consistency
        win.style.height = "200px"; // Slightly larger to fit iframe comfortably
    }

    window.openPlayerWindow = openPlayerWindow;
    window.closePlayerWindow = closePlayerWindow;
});
