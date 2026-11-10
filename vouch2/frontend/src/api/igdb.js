const API_BASE = "/api";

export function getIGDBImageUrl(imageId, size = "cover_big") {
  if (!imageId) return null;
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

export async function searchGames(query) {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(`${API_BASE}/search/game?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) throw new Error(`Game search failed: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("searchGames error:", err);
    return [];
  }
}

export async function getGameDetails(id) {
  if (!id) throw new Error("Game ID is required");
  const res = await fetch(`${API_BASE}/game/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Game details failed: ${res.status}`);
  return await res.json();
}

export async function getPopularGames() {
  try {
    const res = await fetch(`${API_BASE}/games/popular`);
    if (!res.ok) throw new Error(`Popular games failed: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("getPopularGames error:", err);
    return [];
  }
}

export async function getUpcomingGames() {
  try {
    const res = await fetch(`${API_BASE}/games/upcoming`);
    if (!res.ok) throw new Error(`Upcoming games failed: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("getUpcomingGames error:", err);
    return [];
  }
}

export async function getTrendingGames() {
  try {
    const res = await fetch(`${API_BASE}/games/trending`);
    if (!res.ok) throw new Error(`Trending games failed: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("getTrendingGames error:", err);
    return [];
  }
}

