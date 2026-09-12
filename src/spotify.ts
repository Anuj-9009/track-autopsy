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

export async function convertImageUrlToBase64(url: string): Promise<string> {
  if (!url || url.startsWith('data:')) return url;
  try {
    const res = await fetch(url);
    if (!res.ok) return url;

    // Node.js environment
    if (typeof window === 'undefined' && typeof Buffer !== 'undefined') {
      const arrayBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const contentType = res.headers.get('content-type') || 'image/jpeg';
      return `data:${contentType};base64,${base64}`;
    }

    // Browser environment
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      if (typeof FileReader !== 'undefined') {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string' && reader.result.startsWith('data:image')) {
            resolve(reader.result);
          } else {
            resolve(url);
          }
        };
        reader.onerror = () => resolve(url);
        reader.readAsDataURL(blob);
      } else {
        resolve(url);
      }
    });
  } catch (err) {
    console.warn("Direct blob fetch failed, falling back to canvas:", err);
    if (typeof window !== 'undefined') {
      try {
        return await new Promise<string>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || 300;
              canvas.height = img.naturalHeight || 300;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg', 0.95));
                return;
              }
            } catch (e) {
              console.warn("Canvas export failed:", e);
            }
            resolve(url);
          };
          img.onerror = () => resolve(url);
          img.src = url;
        });
      } catch {
        return url;
      }
    }
    return url;
  }
}

export async function fetchPublicTrackMetadata(title: string, artist: string): Promise<SpotifyData | null> {
  try {
    const term = encodeURIComponent(`${artist} ${title}`.trim());
    const res = await fetch(`https://itunes.apple.com/search?term=${term}&entity=song&limit=1`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const item = data.results[0];
    let rawArt = item.artworkUrl100 || "";
    if (rawArt) {
      rawArt = rawArt.replace('/100x100bb.jpg', '/600x600bb.jpg');
    }
    const albumArt = rawArt ? await convertImageUrlToBase64(rawArt) : "";
    const releaseYear = item.releaseDate ? item.releaseDate.split('-')[0] : "";

    return {
      trackId: String(item.trackId || ""),
      name: item.trackName || title,
      artist: item.artistName || artist,
      albumArt,
      releaseYear
    };
  } catch (err) {
    console.warn("Public track metadata search error:", err);
    return null;
  }
}

export async function fetchSpotifyTrackData(title: string, artist: string, clientId?: string, clientSecret?: string): Promise<SpotifyData | null> {
  // If credentials provided, try Spotify first
  if (clientId && clientSecret) {
    try {
      const token = await getAccessToken(clientId, clientSecret);
      const query = encodeURIComponent(`track:${title} artist:${artist}`);
      
      const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.tracks && searchData.tracks.items.length > 0) {
          const track = searchData.tracks.items[0];
          const trackId = track.id;
          const rawAlbumArt = track.album.images[0]?.url || "";
          let albumArt = rawAlbumArt;
          if (rawAlbumArt) {
            albumArt = await convertImageUrlToBase64(rawAlbumArt);
          }
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
        }
      }
    } catch (error) {
      console.warn("Spotify API attempt failed, falling back to public registry:", error);
    }
  }

  // Seamless zero-config fallback to public metadata search
  return await fetchPublicTrackMetadata(title, artist);
}

