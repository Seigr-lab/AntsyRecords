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

    // ✅ Get user-defined icon size (Default: 80px)
    let iconSize = parseInt(localStorage.getItem("iconSize") || 80, 10);
    const padding = 20; // Minimum spacing between icons
    const columns = Math.max(1, Math.floor(containerWidth / (iconSize + padding)));
    let x = 0, y = 0;

    // ✅ Position Icons in a Grid Layout
    icons.forEach((icon, index) => {
        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;
        icon.style.width = `${iconSize}px`;
        icon.style.height = `${iconSize}px`;

        let img = icon.querySelector("img");
        if (img) {
            img.style.width = `${iconSize}px`;
            img.style.height = `${iconSize}px`;
        }

        console.log(`📌 Positioned: ${icon.innerText.trim()} at (${x}px, ${y}px)`);

        // ✅ Move to the next grid position
        if ((index + 1) % columns === 0) {
            x = 0;
            y += iconSize + padding;
        } else {
            x += iconSize + padding;
        }

        // ✅ Ensure icons never overflow the container
        if (y + iconSize > containerHeight) {
            console.warn(`⚠️ Not enough space for all icons! Some may be hidden.`);
        }
    });
}

// ✅ Smooth Dynamic Icon Resizing
function updateIconSizes() {
    console.log("🔄 Updating Icon Sizes...");
    let newSize = parseInt(localStorage.getItem("iconSize") || 80, 10);

    document.querySelectorAll(".icon").forEach(icon => {
        icon.style.transition = "width 0.2s ease, height 0.2s ease";
        icon.style.width = `${newSize}px`;
        icon.style.height = `${newSize}px`;

        let img = icon.querySelector("img");
        if (img) {
            img.style.width = `${newSize}px`;
            img.style.height = `${newSize}px`;
        }
    });

    // ✅ Recalculate Icon Positions After Resize
    setTimeout(initializeIcons, 250);
}

// ✅ Expose functions globally
window.initializeIcons = initializeIcons;
window.updateIconSizes = updateIconSizes;
