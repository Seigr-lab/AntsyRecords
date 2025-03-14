// ✅ resizeHandler.js - Enables Window Resizing
console.log("📏 Resizable Window Handler Loaded");

// ✅ Make an element resizable
export function makeResizable(el) { // ✅ NOW EXPORTED
    // ✅ Prevent duplicate resize handles
    if (el.querySelector(".resize-handle")) {
        console.warn("⚠️ Resize handle already exists on element.");
        return;
    }

    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");
    el.appendChild(resizeHandle);

    let isResizing = false, startX, startY, startWidth, startHeight;

    function startResize(event) {
        event.preventDefault();
        isResizing = true;
        startX = event.touches ? event.touches[0].clientX : event.clientX;
        startY = event.touches ? event.touches[0].clientY : event.clientY;
        startWidth = el.offsetWidth;
        startHeight = el.offsetHeight;

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResizing, { once: true });
        document.addEventListener("touchmove", resize, { passive: false });
        document.addEventListener("touchend", stopResizing, { once: true });
    }

    function resize(event) {
        if (!isResizing) return;

        let clientX = event.touches ? event.touches[0].clientX : event.clientX;
        let clientY = event.touches ? event.touches[0].clientY : event.clientY;

        let newWidth = Math.max(250, Math.min(startWidth + (clientX - startX), window.innerWidth - el.offsetLeft - 20));
        let newHeight = Math.max(200, Math.min(startHeight + (clientY - startY), window.innerHeight - el.offsetTop - 20));

        requestAnimationFrame(() => {
            el.style.width = `${newWidth}px`;
            el.style.height = `${newHeight}px`;
        });
    }

    function stopResizing() {
        isResizing = false;
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("touchmove", resize);
    }

    resizeHandle.addEventListener("mousedown", startResize);
    resizeHandle.addEventListener("touchstart", startResize, { passive: true });

    // ✅ Improved Visual Feedback & Accessibility
    Object.assign(resizeHandle.style, {
        position: "absolute",
        bottom: "4px",
        right: "4px",
        width: "14px",
        height: "14px",
        background: "rgba(255, 255, 255, 0.8)",
        cursor: "nwse-resize",
        borderRadius: "4px",
        zIndex: "999",
        border: "1px solid #333",
        opacity: "0.8",
    });

    console.log("✅ Resizable Feature Added!");
}
