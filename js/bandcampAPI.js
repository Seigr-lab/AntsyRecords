// ✅ bandcampAPI.js - Handles Bandcamp API requests for Antsy Records
console.log("🎵 Bandcamp API Manager Loaded");

// ✅ Import API credentials securely (local for dev, GitHub Secrets in production)
import { getClientId, getClientSecret } from "./credentials.js"; 

const BANDCAMP_AUTH_URL = "https://bandcamp.com/oauth_token";
const BANDCAMP_API_BASE = "https://bandcamp.com/api/";
const LABEL_ID = "antsyrecords"; // ✅ Set your Bandcamp label ID

// ✅ Obtain Access Token from Bandcamp API
async function getAccessToken() {
    console.log("🔑 Requesting Bandcamp Access Token...");

    const clientId = getClientId();
    const clientSecret = getClientSecret();

    if (!clientId || !clientSecret) {
        console.error("❌ Missing Bandcamp API credentials!");
        return null;
    }

    try {
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        params.append("client_id", clientId);
        params.append("client_secret", clientSecret);

        const response = await fetch(BANDCAMP_AUTH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to obtain access token: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.access_token) {
            throw new Error("❌ Invalid OAuth response - No access token received.");
        }

        console.log("✅ Bandcamp Access Token Obtained");
        return data.access_token;
    } catch (error) {
        console.error("❌ Error retrieving Bandcamp access token:", error);
        return null;
    }
}

// ✅ Fetch Bandcamp releases for Antsy Records
export async function fetchBandcampReleases() {
    console.log("📡 Fetching Bandcamp releases...");

    const accessToken = await getAccessToken();
    if (!accessToken) return [];

    try {
        const response = await fetch(`${BANDCAMP_API_BASE}label/${LABEL_ID}/albums`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
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

// ✅ Fetch album data (tracks, stream links, etc.)
export async function fetchAlbumData(albumId) {
    console.log(`🎵 Fetching album data for ID: ${albumId}`);

    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    try {
        const response = await fetch(`${BANDCAMP_API_BASE}album/${albumId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to fetch album data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Album Data:", data);

        if (!data.tracks || !Array.isArray(data.tracks)) {
            throw new Error("❌ Invalid album track data.");
        }

        return {
            albumTitle: data.title,
            artist: data.artist,
            coverUrl: data.art_url || "icons/default-cover.png",
            tracks: data.tracks.map(track => ({
                title: track.title,
                streamUrl: track.streaming_url || "",
            })),
        };

    } catch (error) {
        console.error("❌ Error fetching album data:", error);
        return null;
    }
}

// ✅ Ensure functions are properly exported for external use
export { getAccessToken, fetchBandcampReleases, fetchAlbumData };
