document.addEventListener("DOMContentLoaded", () => {
    console.log("🎵 Catalog Window Manager Loaded");

    function openCatalogWindow() {
        let existingWindow = document.getElementById("music-catalog-window");
        if (existingWindow) {
            bringWindowToFront(existingWindow);
            return;
        }

        let win = document.createElement("div");
        win.id = "music-catalog-window";
        win.classList.add("window", "catalog-window");

        win.style.position = "absolute";
        win.style.left = `${Math.min(100 + Math.random() * 300, window.innerWidth - 500)}px`;
        win.style.top = `${Math.min(100 + Math.random() * 200, window.innerHeight - 400)}px`;
        win.style.zIndex = "100";

        win.innerHTML = `
            <div class="window-header">
                <span>Music Catalog</span>
                <button class="close-btn">✖</button>
            </div>
            <div class="window-content catalog-content">
                <div id="music-catalog" class="music-catalog-container">
                    <p style="color: red;">Loading releases...</p>
                </div>
            </div>
        `;

        document.getElementById("window-container").appendChild(win);

        bringWindowToFront(win);
        makeDraggable(win);
        makeResizable(win);

        win.querySelector(".close-btn").addEventListener("click", closeCatalogWindow);

        // ✅ Load releases and properly adjust window size
        fetchBandcampReleases().then(() => {
            adjustCatalogWindowSize(win);
            enableCatalogIconDrag();
        });
    }

    function closeCatalogWindow() {
        let win = document.getElementById("music-catalog-window");
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

        function onMove(event) {
            if (!isDragging) return;
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

    function adjustCatalogWindowSize(win) {
        let catalogContainer = document.getElementById("music-catalog");
        if (!catalogContainer) return;

        let contentHeight = catalogContainer.scrollHeight + 50;
        let contentWidth = Math.max(catalogContainer.scrollWidth + 100, 400);

        win.style.height = `${Math.min(window.innerHeight * 0.7, contentHeight)}px`;
        win.style.width = `${Math.min(window.innerWidth * 0.8, contentWidth)}px`;
    }

    function enableCatalogIconDrag() {
        let icons = document.querySelectorAll(".music-catalog-container .icon");
        icons.forEach(icon => {
            icon.style.position = "absolute";
            icon.style.cursor = "pointer";
            icon.style.userSelect = "none";

            let shiftX, shiftY;
            let isDragging = false;

            function onMouseMove(event) {
                if (!isDragging) return;
                let clientX = event.clientX;
                let clientY = event.clientY;
                icon.style.left = `${Math.max(0, Math.min(clientX - shiftX, 500))}px`;
                icon.style.top = `${Math.max(0, Math.min(clientY - shiftY, 500))}px`;
            }

            icon.addEventListener("mousedown", function (event) {
                event.preventDefault();
                isDragging = true;
                shiftX = event.clientX - icon.getBoundingClientRect().left;
                shiftY = event.clientY - icon.getBoundingClientRect().top;

                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", () => {
                    isDragging = false;
                    document.removeEventListener("mousemove", onMouseMove);
                }, { once: true });
            });

            // ✅ Enable double-click to open player
            icon.addEventListener("dblclick", function () {
                let albumId = icon.getAttribute("data-album-id");
                let artist = icon.getAttribute("data-artist");
                let title = icon.getAttribute("data-title");

                openWindow("music-player", `Now Playing: ${artist} - ${title}`, albumId, title, artist);
            });
        });
    }

    window.openCatalogWindow = openCatalogWindow;
    window.closeCatalogWindow = closeCatalogWindow;
});
