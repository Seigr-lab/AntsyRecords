function initializeDragManager() {
    console.log("✅ Drag Manager Loaded");

    document.querySelectorAll(".icon").forEach(icon => {
        icon.addEventListener("mousedown", (event) => startDragging(event, icon));
        icon.addEventListener("touchstart", (event) => startDragging(event, icon, true), { passive: false });
        icon.addEventListener("dragstart", (event) => event.preventDefault()); // Disable default drag event
    });
}

function startDragging(event, icon, isTouch = false) {
    event.preventDefault();

    let rect = icon.getBoundingClientRect();
    let shiftX = (isTouch ? event.touches[0].clientX : event.clientX) - rect.left;
    let shiftY = (isTouch ? event.touches[0].clientY : event.clientY) - rect.top;

    let container = icon.closest(".music-catalog-container") || document.getElementById("desktop-container");
    let containerRect = container.getBoundingClientRect();
    let iconSize = 80;
    let isDragging = false;

    function moveAt(x, y) {
        let newLeft = x - shiftX;
        let newTop = y - shiftY;

        newLeft = Math.max(0, Math.min(containerRect.width - iconSize, newLeft));
        newTop = Math.max(0, Math.min(containerRect.height - iconSize, newTop));

        icon.style.position = "absolute";
        icon.style.zIndex = "100";
        icon.style.left = `${newLeft}px`;
        icon.style.top = `${newTop}px`;
    }

    function onMove(event) {
        let clientX = isTouch ? event.touches[0].clientX : event.clientX;
        let clientY = isTouch ? event.touches[0].clientY : event.clientY;
        moveAt(clientX - containerRect.left, clientY - containerRect.top);
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener(isTouch ? "touchmove" : "mousemove", onMove);
        document.removeEventListener(isTouch ? "touchend" : "mouseup", stopDragging);
    }

    document.addEventListener(isTouch ? "touchmove" : "mousemove", onMove);
    document.addEventListener(isTouch ? "touchend" : "mouseup", stopDragging, { once: true });
}

// ✅ Ensure script loads when the page is ready
document.addEventListener("DOMContentLoaded", initializeDragManager);
