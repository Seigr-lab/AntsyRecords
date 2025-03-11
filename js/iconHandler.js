function initializeIcons() {
    console.log("🎨 Initializing Desktop Icons...");

    const icons = document.querySelectorAll(".icon");
    const iconSize = 80; // Icon dimensions
    const padding = 20;  // Padding for spacing
    const desktopContainer = document.getElementById("desktop-container");

    if (!desktopContainer) {
        console.error("❌ Desktop container not found.");
        return;
    }

    const containerWidth = desktopContainer.clientWidth;
    const containerHeight = desktopContainer.clientHeight;
    const usedPositions = [];

    // ✅ Dynamically Position Icons Without Overlap
    icons.forEach(icon => {
        let left, top, attempts = 0, maxAttempts = 50;
        let positionFound = false;

        while (!positionFound && attempts < maxAttempts) {
            left = Math.floor(Math.random() * (containerWidth - iconSize - padding));
            top = Math.floor(Math.random() * (containerHeight - iconSize - padding));

            if (!isOverlapping(left, top)) {
                positionFound = true;
                usedPositions.push({ left, top });
            }
            attempts++;
        }

        icon.style.left = `${left}px`;
        icon.style.top = `${top}px`;

        // ✅ Attach Double-Click / Tap Event
        icon.addEventListener("dblclick", () => handleIconClick(icon));
        icon.addEventListener("touchstart", (event) => {
            event.preventDefault();
            handleIconClick(icon);
        }, { passive: true });

        console.log(`📌 Positioned: ${icon.innerText.trim()} at (${left}px, ${top}px)`);
    });

    function isOverlapping(left, top) {
        return usedPositions.some(pos =>
            Math.abs(pos.left - left) < iconSize + padding &&
            Math.abs(pos.top - top) < iconSize + padding
        );
    }
}

// ✅ Handle Icon Clicks to Open Correct Windows
function handleIconClick(icon) {
    const file = icon.getAttribute("data-file");

    if (!file) {
        console.error("❌ No file associated with this icon.");
        return;
    }

    console.log(`📂 Opening: ${file}`);

    if (file === "music-catalog") {
        openCatalogWindow();  // ✅ Opens dedicated music catalog window
    } else {
        openWindow(file, capitalizeFirstLetter(file));  // ✅ Opens general windows
    }
}

// ✅ Capitalizes First Letter for Window Titles
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ✅ Ensure This Function is Available Globally
window.initializeIcons = initializeIcons;
