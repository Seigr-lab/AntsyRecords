function makeResizable(el) {
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

        document.addEventListener(event.type === "mousedown" ? "mousemove" : "touchmove", resize);
        document.addEventListener(event.type === "mousedown" ? "mouseup" : "touchend", stopResizing, { once: true });
    }

    function resize(event) {
        if (!isResizing) return;
        let clientX = event.touches ? event.touches[0].clientX : event.clientX;
        let clientY = event.touches ? event.touches[0].clientY : event.clientY;

        let newWidth = Math.max(250, Math.min(startWidth + (clientX - startX), window.innerWidth - el.offsetLeft));
        let newHeight = Math.max(200, Math.min(startHeight + (clientY - startY), window.innerHeight - el.offsetTop));

        el.style.width = `${newWidth}px`;
        el.style.height = `${newHeight}px`;
    }

    function stopResizing() {
        isResizing = false;
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("touchmove", resize);
    }

    resizeHandle.addEventListener("mousedown", startResize);
    resizeHandle.addEventListener("touchstart", startResize, { passive: true });

    // ✅ Improve Visual Feedback
    resizeHandle.style.position = "absolute";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.right = "0";
    resizeHandle.style.width = "15px";
    resizeHandle.style.height = "15px";
    resizeHandle.style.background = "#888";
    resizeHandle.style.cursor = "nwse-resize";
    resizeHandle.style.borderRadius = "4px";
}
