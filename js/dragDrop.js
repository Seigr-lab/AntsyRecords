// ✅ dragDrop.js - Handles Drag & Drop Initialization
console.log("✅ Drag & Drop Manager Loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initializing Drag & Drop Functionality...");

    // ✅ Ensure Dragging is Enabled from `iconHandler.js`
    if (typeof enableIconDragging === "function") {
        try {
            enableIconDragging();
            console.log("✅ Icon Dragging is Active.");
        } catch (error) {
            console.error("❌ Error enabling Icon Dragging:", error);
        }
    } else {
        console.warn("⚠️ enableIconDragging() is not defined! Icons may not be draggable.");
    }

    // ✅ Attach Drag Event Listeners Once
    attachDragDropListeners();

    console.log("✅ Drag & Drop Fully Initialized.");
});

// ✅ Attach Drag & Drop Event Listeners (Prevents Redundant Attachments)
function attachDragDropListeners() {
    console.log("🔄 Attaching Drag & Drop Event Listeners...");

    document.querySelectorAll(".icon").forEach(icon => {
        if (!icon.hasAttribute("draggable")) {
            icon.setAttribute("draggable", "true");

            icon.addEventListener("dragstart", handleDragStart);
            icon.addEventListener("dragend", handleDragEnd);
            icon.addEventListener("dragover", handleDragOver);
            icon.addEventListener("drop", handleDrop);

            // ✅ Add touch support for mobile users
            icon.addEventListener("touchstart", handleTouchDragStart, { passive: true });
            icon.addEventListener("touchmove", handleTouchDragMove, { passive: false });
            icon.addEventListener("touchend", handleTouchDragEnd);
        }
    });

    console.log("✅ Drag & Drop Listeners Attached.");
}

// ✅ Handle Drag Start
function handleDragStart(event) {
    console.log(`📦 Dragging Icon: ${event.target.innerText.trim()}`);
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
}

// ✅ Handle Drag End
function handleDragEnd(event) {
    console.log(`✅ Drag Ended: ${event.target.innerText.trim()}`);
    event.target.classList.remove("dragging");
}

// ✅ Handle Drag Over (Prevents Default Behavior)
function handleDragOver(event) {
    event.preventDefault();
}

// ✅ Handle Drop (Persists Position Instead of Nesting)
function handleDrop(event) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedId);

    if (!draggedElement) return;

    // ✅ Move the icon instead of appending inside another
    let dropX = event.clientX - draggedElement.offsetWidth / 2;
    let dropY = event.clientY - draggedElement.offsetHeight / 2;

    dropX = Math.max(0, Math.min(dropX, window.innerWidth - draggedElement.offsetWidth));
    dropY = Math.max(0, Math.min(dropY, window.innerHeight - draggedElement.offsetHeight));

    draggedElement.style.position = "absolute";
    draggedElement.style.left = `${dropX}px`;
    draggedElement.style.top = `${dropY}px`;

    // ✅ Save new position
    let savedPositions = JSON.parse(localStorage.getItem("iconPositions")) || {};
    savedPositions[draggedId] = { x: dropX, y: dropY };
    localStorage.setItem("iconPositions", JSON.stringify(savedPositions));

    console.log(`✅ Dropped Icon: ${draggedElement.innerText.trim()} at (${dropX}px, ${dropY}px)`);
}

// ✅ Touch Dragging for Mobile Users
let touchDragElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

function handleTouchDragStart(event) {
    touchDragElement = event.target.closest(".icon");
    if (!touchDragElement) return;

    let rect = touchDragElement.getBoundingClientRect();
    touchOffsetX = event.touches[0].clientX - rect.left;
    touchOffsetY = event.touches[0].clientY - rect.top;

    touchDragElement.classList.add("dragging");
}

function handleTouchDragMove(event) {
    if (!touchDragElement) return;

    let moveX = event.touches[0].clientX - touchOffsetX;
    let moveY = event.touches[0].clientY - touchOffsetY;

    moveX = Math.max(0, Math.min(moveX, window.innerWidth - touchDragElement.offsetWidth));
    moveY = Math.max(0, Math.min(moveY, window.innerHeight - touchDragElement.offsetHeight));

    touchDragElement.style.position = "absolute";
    touchDragElement.style.left = `${moveX}px`;
    touchDragElement.style.top = `${moveY}px`;

    event.preventDefault();
}

function handleTouchDragEnd() {
    if (!touchDragElement) return;

    let savedPositions = JSON.parse(localStorage.getItem("iconPositions")) || {};
    savedPositions[touchDragElement.id] = {
        x: parseInt(touchDragElement.style.left, 10),
        y: parseInt(touchDragElement.style.top, 10),
    };
    localStorage.setItem("iconPositions", JSON.stringify(savedPositions));

    touchDragElement.classList.remove("dragging");
    touchDragElement = null;
}

// ✅ Expose Functions Globally if Needed
window.attachDragDropListeners = attachDragDropListeners;
