// ✅ windowManager.js - Centralized Window Controller
console.log("✅ Window Manager Loaded");

// ✅ Global tracking of open windows
const openWindows = {};
let highestZIndex = 100;

// ✅ Create a new window (Each window defines its own content via callback)
function createWindow(id, title, width = 800, height = 600, contentLoader) {
    console.log(`🖥 Opening Window: ${title}`);

    // ✅ Prevent duplicate windows
    if (openWindows[id]) {
        bringWindowToFront(openWindows[id]);
        return;
    }

    // ✅ Create the window container
    let win = document.createElement("div");
    win.id = id;
    win.classList.add("window");

    // ✅ Ensure window appears within the visible screen
    const leftPos = Math.min(100 + Math.random() * 300, window.innerWidth - width - 20);
    const topPos = Math.min(100 + Math.random() * 200, window.innerHeight - height - 20);

    win.style.position = "absolute";
    win.style.left = `${Math.max(20, leftPos)}px`;
    win.style.top = `${Math.max(20, topPos)}px`;
    win.style.width = `${width}px`;
    win.style.height = `${height}px`;
    win.style.zIndex = `${++highestZIndex}`;
    win.style.minWidth = "350px";
    win.style.minHeight = "250px";

    // ✅ Base window structure (content is injected dynamically)
    win.innerHTML = `
        <div class="window-header">
            <span>${title}</span>
            <button class="close-btn">✖</button>
        </div>
        <div class="window-content">${getLoadingMessage()}</div>
    `;

    // ✅ Append window to main container
    document.getElementById("window-container").appendChild(win);
    openWindows[id] = win;

    // ✅ Enable dragging and resizing
    makeDraggable(win);
    makeResizable(win);

    // ✅ Close button event
    win.querySelector(".close-btn").addEventListener("click", () => closeWindow(id));

    bringWindowToFront(win);

    // ✅ Inject content using the provided function (defined in individual window scripts)
    if (typeof contentLoader === "function") {
        contentLoader(win.querySelector(".window-content"));
    } else {
        console.error(`❌ No valid contentLoader function for ${id}`);
    }
}

// ✅ Bring window to the front dynamically
function bringWindowToFront(win) {
    highestZIndex++;
    win.style.zIndex = highestZIndex;
}

// ✅ Make a window draggable
function makeDraggable(win) {
    let header = win.querySelector(".window-header");
    let shiftX, shiftY;
    let isDragging = false;

    function moveWindow(clientX, clientY) {
        let newLeft = Math.max(0, Math.min(clientX - shiftX, window.innerWidth - win.offsetWidth));
        let newTop = Math.max(0, Math.min(clientY - shiftY, window.innerHeight - win.offsetHeight));

        requestAnimationFrame(() => {
            win.style.left = `${newLeft}px`;
            win.style.top = `${newTop}px`;
        });
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

// ✅ Make window resizable with constraints
function makeResizable(win) {
    win.style.resize = "both";
    win.style.overflow = "auto";
}

// ✅ Global function to close a window
function closeWindow(id) {
    if (openWindows[id]) {
        openWindows[id].remove();
        delete openWindows[id];
    }
}

// ✅ Default loading message
function getLoadingMessage() {
    return `<p style="color: white;">Loading...</p>`;
}

// ✅ Define global functions to open specific windows (Each loads its own content)
window.openCatalogWindow = function () {
    createWindow("catalog-window", "Music Catalog", 800, 600, loadCatalogContent);
};

window.openAboutWindow = function () {
    createWindow("about-window", "About Antsy Records", 600, 500, loadAboutContent);
};

window.openSettingsWindow = function () {
    createWindow("settings-window", "Settings", 600, 500, loadSettingsContent);
};

// ✅ Content loading functions (loaded dynamically in respective scripts)
function loadCatalogContent(contentDiv) {
    import("./catalogWindow.js")
        .then(module => module.loadCatalogContent(contentDiv))
        .catch(() => contentDiv.innerHTML = `<p style="color:red;">❌ Failed to load catalog.</p>`);
}

function loadAboutContent(contentDiv) {
    fetch("windows/about.html")
        .then(response => response.text())
        .then(html => contentDiv.innerHTML = html)
        .catch(() => contentDiv.innerHTML = `<p style="color:red;">❌ Failed to load about page.</p>`);
}

function loadSettingsContent(contentDiv) {
    import("./settingsWindow.js")
        .then(module => module.openSettingsWindow(contentDiv))
        .catch(() => contentDiv.innerHTML = `<p style="color:red;">❌ Failed to load settings.</p>`);
}

// ✅ Ensure `initializeWindows` exists globally (fallback mechanism)
window.initializeWindows = function () {
    console.log("✅ Initializing Windows...");
};
