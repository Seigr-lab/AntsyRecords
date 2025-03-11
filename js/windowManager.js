document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Window Manager Loaded");

    function openWindow(file, title, albumId = null, albumTitle = null, artist = null) {
        console.log(`📂 Opening window for: ${file}`);

        let existingWindow = document.getElementById(`${file}-window`);
        if (existingWindow) {
            bringWindowToFront(existingWindow);
            return;
        }

        switch (file) {
            case "music-catalog":
                openCatalogWindow();
                return;
            case "music-player":
                if (albumId) {
                    openPlayerWindow(albumId, albumTitle, artist);
                } else {
                    console.error("❌ No album ID provided for music player!");
                }
                return;
            case "about":
                openGenericWindow(file, title);
                return;
            default:
                console.warn(`⚠️ No specific function for '${file}', using generic loader.`);
                openGenericWindow(file, title);
        }
    }

    function openGenericWindow(file, title) {
        let win = document.createElement("div");
        win.id = `${file}-window`;
        win.classList.add("window");

        win.style.position = "absolute";
        win.style.left = `${Math.min(100 + Math.random() * 300, window.innerWidth - 320)}px`;
        win.style.top = `${Math.min(100 + Math.random() * 200, window.innerHeight - 250)}px`;
        win.style.zIndex = "100";

        win.innerHTML = `
            <div class="window-header">
                <span>${title}</span>
                <button class="close-btn">✖</button>
            </div>
            <div class="window-content" id="${file}-content">
                <p style="color: red;">Loading...</p>
            </div>
        `;

        document.getElementById("window-container").appendChild(win);
        bringWindowToFront(win);
        makeDraggable(win);
        makeResizable(win);

        win.querySelector(".close-btn").addEventListener("click", () => closeWindow(file));

        fetch(`windows/${file}.html`)
            .then(response => response.ok ? response.text() : Promise.reject())
            .then(html => document.getElementById(`${file}-content`).innerHTML = html)
            .catch(() => {
                document.getElementById(`${file}-content`).innerHTML = `<p style="color:red;">Failed to load content.</p>`;
            });
    }

    function openPlayerWindow(albumId, title, artist) {
        console.log(`🎵 Opening player window for: ${title} by ${artist}`);

        let existingWindow = document.getElementById(`player-${albumId}-window`);
        if (existingWindow) {
            bringWindowToFront(existingWindow);
            return;
        }

        let win = document.createElement("div");
        win.id = `player-${albumId}-window`;
        win.classList.add("window", "player-window");

        win.style.position = "absolute";
        win.style.left = `${Math.min(100 + Math.random() * 300, window.innerWidth - 320)}px`;
        win.style.top = `${Math.min(100 + Math.random() * 200, window.innerHeight - 250)}px`;
        win.style.zIndex = "100";

        win.innerHTML = `
            <div class="window-header">
                <span>Now Playing: ${title}</span>
                <button class="close-btn">✖</button>
            </div>
            <div class="window-content">
                <iframe style="width:100%; height:150px; border:none;"
                    src="https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=333333/linkcol=ffffff/minimal=true/transparent=true/"></iframe>
            </div>
        `;

        document.getElementById("window-container").appendChild(win);
        bringWindowToFront(win);
        makeDraggable(win);
        makeResizable(win);

        win.querySelector(".close-btn").addEventListener("click", () => {
            win.remove();
        });
    }

    function closeWindow(file) {
        let windowElement = document.getElementById(`${file}-window`);
        if (windowElement) {
            windowElement.remove();
        }
    }

    function bringWindowToFront(win) {
        document.querySelectorAll(".window").forEach(w => w.style.zIndex = "10");
        win.style.zIndex = "200";
    }

    function makeDraggable(win) {
        let header = win.querySelector(".window-header");
        let shiftX, shiftY;
        let isDragging = false;

        function onMove(event) {
            let clientX = event.touches ? event.touches[0].clientX : event.clientX;
            let clientY = event.touches ? event.touches[0].clientY : event.clientY;
            win.style.left = `${Math.max(0, Math.min(clientX - shiftX, window.innerWidth - win.offsetWidth))}px`;
            win.style.top = `${Math.max(0, Math.min(clientY - shiftY, window.innerHeight - win.offsetHeight))}px`;
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
            document.addEventListener(event.type === "mousedown" ? "mouseup" : "touchend", () => {
                isDragging = false;
                document.removeEventListener(event.type === "mousedown" ? "mousemove" : "touchmove", onMove);
            }, { once: true });
        }

        header.addEventListener("mousedown", startDrag);
        header.addEventListener("touchstart", startDrag, { passive: true });
        header.style.cursor = "grab";
    }

    function makeResizable(win) {
        win.style.resize = "both";
        win.style.overflow = "auto";
    }

    window.openWindow = openWindow;
    window.closeWindow = closeWindow;
    window.openPlayerWindow = openPlayerWindow;
});
