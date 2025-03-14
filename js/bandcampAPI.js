// ✅ bandcampAPI.js - Handles Bandcamp API interactions
import { getClientId, getClientSecret } from "./credentials.js";

console.log("🎵 Bandcamp API Manager Loaded");

// ✅ Function to obtain an access token from Bandcamp
async function getAccessToken() {
    const clientId = getClientId();
    const clientSecret = getClientSecret();

    if (!clientId || !clientSecret) {
        console.error("❌ Missing Bandcamp API credentials!");
        return null;
    }

    const tokenUrl = "https://bandcamp.com/oauth_token";
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    try {
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
        });

        if (!response.ok) throw new Error(`Failed to get access token: ${response.statusText}`);

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("❌ Error fetching access token:", error);
        return null;
    }
}

// ✅ Fetch Bandcamp releases
async function fetchBandcampReleases() {
    const accessToken = await getAccessToken();
    if (!accessToken) return [];

    const apiUrl = "https://bandcamp.com/api/your_endpoint"; // Replace with actual API URL
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) throw new Error(`Failed to fetch releases: ${response.statusText}`);

        const data = await response.json();
        return data.releases; // Adjust based on API response structure
    } catch (error) {
        console.error("❌ Error fetching releases:", error);
        return [];
    }
}

// ✅ Fetch album details including tracks & streaming URLs
async function fetchAlbumData(albumId) {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const apiUrl = `https://bandcamp.com/api/trackinfo/1/get?album_id=${albumId}`; // Corrected URL
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) throw new Error(`Failed to fetch album data: ${response.statusText}`);

        const data = await response.json();
        return {
            albumTitle: data.title,
            artist: data.artist,
            coverUrl: data.art_url,
            tracks: data.tracks.map(track => ({
                title: track.title,
                streamUrl: track.streaming_url,
            })),
        };
    } catch (error) {
        console.error("❌ Error fetching album data:", error);
        return null;
    }
}

// ✅ Expose API functions
export { fetchBandcampReleases, fetchAlbumData };
