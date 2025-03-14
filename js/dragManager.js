// ✅ dragManager.js - Handles Dragging for Desktop & Catalog Icons
console.log("✅ Drag Manager Loaded");

function initializeDragManager() {
    console.log("🚀 Initializing Drag Manager...");

    document.querySelectorAll(".icon").forEach(icon => {
        if (!icon.hasAttribute("draggable")) {
            icon.setAttribute("draggable", "true");
        }

        icon.addEventListener("mousedown", (event) => startDragging(event, icon, false));
        icon.addEventListener("touchstart", (event) => startDragging(event, icon, true), { passive: false });
        icon.addEventListener("dragstart", (event) => event.preventDefault()); // ✅ Prevent default drag behavior
    });

    console.log("✅ Drag Manager Successfully Initialized.");
}

function startDragging(event, icon, isTouch = false) {
    event.preventDefault();

    const rect = icon.getBoundingClientRect();
    const shiftX = (isTouch ? event.touches[0].clientX : event.clientX) - rect.left;
    const shiftY = (isTouch ? event.touches[0].clientY : event.clientY) - rect.top;

    const container = icon.closest(".music-catalog-container") || document.getElementById("desktop-container");
    if (!container) {
        console.error("❌ Dragging failed: No valid container found!");
        return;
    }

    const containerRect = container.getBoundingClientRect();
    const iconSize = icon.offsetWidth; // ✅ Dynamically adjust based on actual icon size
    let isDragging = true;

    function moveAt(clientX, clientY) {
        let newLeft = Math.max(0, Math.min(clientX - shiftX - containerRect.left, containerRect.width - iconSize));
        let newTop = Math.max(0, Math.min(clientY - shiftY - containerRect.top, containerRect.height - iconSize));

        // ✅ Apply new position smoothly using requestAnimationFrame
        requestAnimationFrame(() => {
            icon.style.position = "absolute";
            icon.style.zIndex = "100";
            icon.style.left = `${newLeft}px`;
            icon.style.top = `${newTop}px`;
        });
    }

    function onMove(event) {
        if (!isDragging) return;
        event.preventDefault(); // ✅ Prevent scrolling on mobile
        const clientX = isTouch ? event.touches[0].clientX : event.clientX;
        const clientY = isTouch ? event.touches[0].clientY : event.clientY;
        moveAt(clientX, clientY);
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener(isTouch ? "touchmove" : "mousemove", onMove);
        document.removeEventListener(isTouch ? "touchend" : "mouseup", stopDragging);
    }

    document.addEventListener(isTouch ? "touchmove" : "mousemove", onMove, { passive: false });
    document.addEventListener(isTouch ? "touchend" : "mouseup", stopDragging, { once: true });
}

// ✅ Ensure script loads when the page is ready
document.addEventListener("DOMContentLoaded", initializeDragManager);
