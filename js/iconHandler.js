// ✅ iconHandler.js - Handles Icon Layout & Positioning
console.log("🎨 Initializing Desktop Icons...");

function initializeIcons() {
    console.log("🖥 Organizing Desktop Icons...");

    const icons = document.querySelectorAll(".icon");
    const desktopContainer = document.getElementById("desktop-container");

    if (!desktopContainer) {
        console.error("❌ Desktop container not found.");
        return;
    }

    const containerWidth = desktopContainer.clientWidth;
    const containerHeight = desktopContainer.clientHeight;
    const usedPositions = [];

    // ✅ Get user-defined icon size (Default: 80px)
    let iconSize = parseInt(localStorage.getItem("iconSize") || 80, 10);
    const padding = 20; // Minimum spacing between icons

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

        // ✅ Apply Position & Size
        icon.style.left = `${left}px`;
        icon.style.top = `${top}px`;
        icon.style.width = `${iconSize}px`;
        icon.style.height = `${iconSize}px`;

        let img = icon.querySelector("img");
        if (img) {
            img.style.width = `${iconSize}px`;
            img.style.height = `${iconSize}px`;
        }

        console.log(`📌 Positioned: ${icon.innerText.trim()} at (${left}px, ${top}px)`);
    });

    function isOverlapping(left, top) {
        return usedPositions.some(pos =>
            Math.abs(pos.left - left) < iconSize + padding &&
            Math.abs(pos.top - top) < iconSize + padding
        );
    }
}

// ✅ Allow Dynamic Icon Resizing
function updateIconSizes() {
    console.log("🔄 Updating Icon Sizes...");
    let newSize = parseInt(localStorage.getItem("iconSize") || 80, 10);

    document.querySelectorAll(".icon").forEach(icon => {
        icon.style.width = `${newSize}px`;
        icon.style.height = `${newSize}px`;

        let img = icon.querySelector("img");
        if (img) {
            img.style.width = `${newSize}px`;
            img.style.height = `${newSize}px`;
        }
    });
}

// ✅ Expose functions globally
window.initializeIcons = initializeIcons;
window.updateIconSizes = updateIconSizes;
