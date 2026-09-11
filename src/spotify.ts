let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export interface SpotifyData {
  trackId: string;
  name: string;
  artist: string;
  albumArt: string;
  releaseYear: string;
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get Spotify access token");
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  return data.access_token;
}

export async function fetchSpotifyTrackData(title: string, artist: string, clientId?: string, clientSecret?: string): Promise<SpotifyData | null> {
  if (!clientId || !clientSecret) return null;

  try {
    const token = await getAccessToken(clientId, clientSecret);
    const query = encodeURIComponent(`track:${title} artist:${artist}`);
    
    // 1. Search for the track
    const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    
    if (!searchData.tracks || searchData.tracks.items.length === 0) {
      return null;
    }
    
    const track = searchData.tracks.items[0];
    const trackId = track.id;
    const albumArt = track.album.images[0]?.url || "";
    const releaseYear = track.album.release_date ? track.album.release_date.split('-')[0] : "";
    const realName = track.name;
    const realArtist = track.artists[0].name;

    return {
      trackId,
      name: realName,
      artist: realArtist,
      albumArt,
      releaseYear
    };
  } catch (error) {
    console.error("Spotify API Error:", error);
    return null;
  }
}
