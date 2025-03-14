// ✅ bandcampAPI.js - Handles Bandcamp API requests for Antsy Records
console.log("🎵 Bandcamp API Manager Loaded");

// ✅ Use Correct Developer API Endpoint
const BANDCAMP_API_BASE = "https://bandcamp.com/api/developer/1.0/";
const LABEL_ID = "antsyrecords"; 

// ✅ Fetch Bandcamp releases (Full catalog)
export async function fetchBandcampReleases() {
    console.log("📡 Fetching Bandcamp releases...");

    try {
        const response = await fetch(`${BANDCAMP_API_BASE}label/${LABEL_ID}/albums`, {
            method: "GET",
            headers: { "Accept": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to fetch releases: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || !Array.isArray(data.albums)) {
            throw new Error("❌ Invalid API response structure.");
        }

        console.log("✅ Releases fetched:", data.albums);

        return data.albums.map(album => ({
            albumId: album.id,
            title: album.title,
            artist: album.artist,
            cover: album.thumb_url || "icons/default-cover.png",
        }));

    } catch (error) {
        console.error("❌ Error fetching Bandcamp releases:", error);
        return [];
    }
}

// ✅ Fetch a single album's data (Fix for `playerWindow.js`)
export async function fetchAlbumData(albumId) {
    if (!albumId) {
        console.error("❌ Album ID is required!");
        return null;
    }

    console.log(`📡 Fetching details for album ID: ${albumId}`);

    try {
        const response = await fetch(`${BANDCAMP_API_BASE}album/${albumId}`, {
            method: "GET",
            headers: { "Accept": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to fetch album data: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || !data.title || !data.artist) {
            throw new Error("❌ Invalid API response for album data.");
        }

        console.log(`✅ Album fetched: ${data.title} by ${data.artist}`);

        return {
            albumId: albumId,
            title: data.title,
            artist: data.artist,
            cover: data.thumb_url || "icons/default-cover.png",
            tracks: data.tracks || [],
        };

    } catch (error) {
        console.error(`❌ Error fetching album data for ${albumId}:`, error);
        return null;
    }
}
