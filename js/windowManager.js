// ✅ windowManager.js - Centralized Window Controller
console.log("✅ Window Manager Loaded");

// ✅ Global tracking of open windows
const openWindows = {};

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
    win.style.position = "absolute";
    win.style.left = `${Math.min(100 + Math.random() * 300, window.innerWidth - width)}px`;
    win.style.top = `${Math.min(100 + Math.random() * 200, window.innerHeight - height)}px`;
    win.style.width = `${width}px`;
    win.style.height = `${height}px`;
    win.style.zIndex = "100";

    // ✅ Base window structure (content is injected dynamically)
    win.innerHTML = `
        <div class="window-header">
            <span>${title}</span>
            <button class="close-btn">✖</button>
        </div>
        <div class="window-content"></div>
    `;

    // ✅ Append window to main container
    document.getElementById("window-container").appendChild(win);
    openWindows[id] = win;

    // ✅ Enable dragging and resizing
    makeDraggable(win);
    makeResizable(win);

    // ✅ Close button event
    win.querySelector(".close-btn").addEventListener("click", () => {
        win.remove();
        delete openWindows[id];
    });

    bringWindowToFront(win);

    // ✅ Inject content using the provided function (defined in individual window scripts)
    if (typeof contentLoader === "function") {
        contentLoader(win.querySelector(".window-content"));
    } else {
        console.error(`❌ No valid contentLoader function for ${id}`);
    }
}

// ✅ Bring window to the front
function bringWindowToFront(win) {
    win.style.zIndex = "200";
}

// ✅ Make a window draggable
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

// ✅ Make window resizable
function makeResizable(win) {
    win.style.resize = "both";
    win.style.overflow = "auto";
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
    contentDiv.innerHTML = `<p style="color: white;">Loading catalog...</p>`;
    import("./catalogWindow.js").then(module => module.loadCatalogContent(contentDiv));
}

function loadAboutContent(contentDiv) {
    contentDiv.innerHTML = `<p style="color: white;">Loading about page...</p>`;
    fetch("windows/about.html")
        .then(response => response.text())
        .then(html => contentDiv.innerHTML = html)
        .catch(() => contentDiv.innerHTML = `<p style="color:red;">Failed to load about page.</p>`);
}

function loadSettingsContent(contentDiv) {
    contentDiv.innerHTML = `<p style="color: white;">Loading settings...</p>`;
    import("./settingsWindow.js").then(module => module.loadSettingsContent(contentDiv));
}

// ✅ Ensure `initializeWindows` exists globally (fallback mechanism)
window.initializeWindows = function () {
    console.log("✅ Initializing Windows...");
};
