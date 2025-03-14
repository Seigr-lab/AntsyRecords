// ✅ aboutWindow.js - Loads About Page Content
console.log("ℹ️ About Window Manager Loaded");

export function loadAboutContent(contentDiv) {
    fetch("windows/about.html")
        .then(response => response.text())
        .then(html => contentDiv.innerHTML = html)
        .catch(() => contentDiv.innerHTML = `<p style="color:red;">Failed to load about page.</p>`);
}
