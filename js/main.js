document.addEventListener("DOMContentLoaded", () => {
    console.time("🏁 Homepage Initialization Time");
    console.log(`[${new Date().toISOString()}] 🚀 Initializing Antsy Records Homepage...`);

    // ✅ Initialize Icons if Function Exists
    if (typeof initializeIcons === "function") {
        try {
            initializeIcons();
            console.log("🎨 Icons successfully initialized.");
        } catch (error) {
            console.error("❌ Error initializing icons:", error);
        }
    } else {
        console.warn("⚠️ initializeIcons() is not defined.");
    }

    // ✅ Defer Bandcamp API Calls for Better Performance
    function fetchBandcamp() {
        try {
            if (typeof fetchBandcampReleases === "function") {
                fetchBandcampReleases();
                console.log("🎵 Fetching Bandcamp Releases...");
            } else {
                console.warn("⚠️ fetchBandcampReleases() is not defined.");
            }
        } catch (error) {
            console.error("❌ Error fetching Bandcamp releases:", error);
        }
    }

    if ("requestIdleCallback" in window) {
        requestIdleCallback(fetchBandcamp);
    } else {
        setTimeout(fetchBandcamp, 1500); // ✅ Fallback for Unsupported Browsers
    }

    // ✅ Lazy-load Markdown Support (Future-Proofing)
    if (document.querySelector(".markdown-content") && typeof marked === "undefined") {
        console.warn("⚠️ Marked.js is not loaded. Lazy-loading Markdown support...");

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
        script.async = true;
        script.onload = () => console.log("✅ Marked.js Loaded.");
        script.onerror = () => console.error("❌ Failed to load Marked.js.");
        document.body.appendChild(script);
    }

    // ✅ Log Completion & Performance Benchmark
    console.log(`[${new Date().toISOString()}] ✅ Homepage Fully Initialized.`);
    console.timeEnd("🏁 Homepage Initialization Time");
});
