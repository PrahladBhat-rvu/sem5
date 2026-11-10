const API_BASE = "/api";

// ============================================================
// TMDB IMAGE
// ============================================================

export function getTMDBImageUrl(path, size = "w500") {
  if (!path) {
    return null;
  }
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/api/image/")) {
    return path;
  }
  return `${API_BASE}/image/${size}${path}`;
}

// ============================================================
// MOVIE SEARCH
// ============================================================

export async function searchMovies(query) {
  if (!query?.trim()) {
    return [];
  }

  const response = await fetch(
    `${API_BASE}/search/movie?query=${encodeURIComponent(query.trim())}`
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

// ============================================================
// MOVIE DETAILS
// ============================================================

export async function getMovieDetails(movieId, type) {
  if (!movieId) {
    throw new Error("Movie ID is required.");
  }

  const endpoint = type === "tv"
    ? `${API_BASE}/tv/${encodeURIComponent(movieId)}`
    : `${API_BASE}/movie/${encodeURIComponent(movieId)}${type ? `?type=${type}` : ""}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    let message = `Movie details failed: ${response.status}`;
    try {
      const data = await response.json();
      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Ignore JSON parsing errors.
    }
    throw new Error(message);
  }

  return await response.json();
}

// ============================================================
// TRENDING MOVIES
// ============================================================

export async function getTrendingMovies(timeWindow = "week") {
  try {
    const response = await fetch(`${API_BASE}/movies/trending?timeWindow=${timeWindow}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn("Falling back to curated trending movies:", err);
  }

  return FALLBACK_TRENDING;
}

// ============================================================
// NEW RELEASES / NOW PLAYING
// ============================================================

export async function getNewReleases(page = 1) {
  try {
    const response = await fetch(`${API_BASE}/movies/new-releases?page=${page}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn("Falling back to curated new releases:", err);
  }

  return FALLBACK_NEW_RELEASES;
}

// ============================================================
// DISCOVER MOVIES (with genre & sorting)
// ============================================================

export async function getDiscoverMovies({ genre = "", sortBy = "popularity.desc", page = 1 } = {}) {
  try {
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);
    if (sortBy) params.append("sortBy", sortBy);
    if (page) params.append("page", page);

    const response = await fetch(`${API_BASE}/movies/discover?${params.toString()}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn("Falling back to curated discover list:", err);
  }

  // Filter fallback by genre if provided
  if (genre) {
    const lower = genre.toLowerCase();
    const filtered = ALL_CURATED_MOVIES.filter((m) =>
      m.genres?.some((g) => g.toLowerCase().includes(lower))
    );
    if (filtered.length > 0) return filtered;
  }

  return ALL_CURATED_MOVIES;
}

// ============================================================
// MOVIES BY CATEGORY (for Category.jsx)
// ============================================================

export async function getMoviesByCategory(subcategory) {
  try {
    const response = await fetch(
      `${API_BASE}/movies/category/${encodeURIComponent(subcategory || "")}`
    );
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.movies)) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Falling back for category:", subcategory, err);
  }

  const sub = (subcategory || "").toLowerCase();
  const matched = ALL_CURATED_MOVIES.filter((m) =>
    m.genres?.some((g) => g.toLowerCase().includes(sub))
  );

  const movies = matched.length > 0 ? matched : ALL_CURATED_MOVIES.slice(0, 8);

  return {
    movies: movies.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.year,
      rating: m.rating,
      image: m.image || (m.poster_path ? getTMDBImageUrl(m.poster_path) : null),
      genres: m.genres,
    })),
    totalResults: movies.length,
  };
}

// ============================================================
// CURATED FALLBACK DATA
// ============================================================

export const FALLBACK_TRENDING = [
  {
    id: 693134,
    title: "Dune: Part Two",
    year: "2024",
    rating: "8.6",
    vote_average: 8.6,
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    image: "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    genres: ["Sci-Fi", "Adventure"],
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
  },
  {
    id: 872585,
    title: "Oppenheimer",
    year: "2023",
    rating: "8.9",
    vote_average: 8.9,
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    image: "/api/image/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    genres: ["Drama", "History"],
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
  },
  {
    id: 157336,
    title: "Interstellar",
    year: "2014",
    rating: "8.7",
    vote_average: 8.7,
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    image: "/api/image/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    vote_average: 9.0,
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    image: "/api/image/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    genres: ["Action", "Crime", "Drama"],
    overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
  },
  {
    id: 27205,
    title: "Inception",
    year: "2010",
    rating: "8.8",
    vote_average: 8.8,
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    image: "/api/image/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    genres: ["Action", "Sci-Fi", "Adventure"],
    overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
  },
  {
    id: 792307,
    title: "Poor Things",
    year: "2023",
    rating: "7.8",
    vote_average: 7.8,
    poster_path: "/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    image: "/api/image/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    genres: ["Comedy", "Sci-Fi", "Romance"],
    overview: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by an unorthodox scientist.",
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    year: "2023",
    rating: "8.6",
    vote_average: 8.6,
    poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    image: "/api/image/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    genres: ["Animation", "Action", "Adventure"],
    overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence.",
  },
  {
    id: 937287,
    title: "Challengers",
    year: "2024",
    rating: "7.5",
    vote_average: 7.5,
    poster_path: "/H6vke7zGiuL7z4v0MG49aKnKVm.jpg",
    image: "/api/image/w500/H6vke7zGiuL7z4v0MG49aKnKVm.jpg",
    genres: ["Drama", "Romance"],
    overview: "Tashi, a tennis player turned coach, has transformed her husband into a world-famous Grand Slam champion.",
  },
];

export const FALLBACK_NEW_RELEASES = [
  {
    id: 933260,
    title: "The Substance",
    year: "2024",
    rating: "7.6",
    vote_average: 7.6,
    release_date: "2024-09-20",
    poster_path: "/lqoMzCcZYEFK729Fc6rKRQDz2kf.jpg",
    image: "/api/image/w500/lqoMzCcZYEFK729Fc6rKRQDz2kf.jpg",
    genres: ["Horror", "Sci-Fi", "Drama"],
    overview: "A fading celebrity decides to use a black market drug, a cell-replicating substance that temporarily creates a younger, better version of herself.",
    tagline: "Have you ever dreamed of a better version of yourself?",
  },
  {
    id: 945961,
    title: "Alien: Romulus",
    year: "2024",
    rating: "7.3",
    vote_average: 7.3,
    release_date: "2024-08-16",
    poster_path: "/b33nnKl1GSFbao8l3urMZX443tF.jpg",
    image: "/api/image/w500/b33nnKl1GSFbao8l3urMZX443tF.jpg",
    genres: ["Horror", "Sci-Fi"],
    overview: "While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.",
    tagline: "In space, no one can hear you scream.",
  },
  {
    id: 786892,
    title: "Furiosa: A Mad Max Saga",
    year: "2024",
    rating: "7.7",
    vote_average: 7.7,
    release_date: "2024-05-24",
    poster_path: "/iADOJ8Zymht2JPMoy3R7xUMZqaC.jpg",
    image: "/api/image/w500/iADOJ8Zymht2JPMoy3R7xUMZqaC.jpg",
    genres: ["Action", "Adventure", "Sci-Fi"],
    overview: "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus.",
    tagline: "Out of the ashes, she will arise.",
  },
  {
    id: 929590,
    title: "Civil War",
    year: "2024",
    rating: "7.3",
    vote_average: 7.3,
    release_date: "2024-04-12",
    poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    image: "/api/image/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    genres: ["Action", "Drama", "War"],
    overview: "In a near-future dystopian America, a team of military-embedded journalists race across the country to reach Washington, D.C. before rebel factions descend upon the White House.",
    tagline: "Welcome to the frontline.",
  },
  {
    id: 1022789,
    title: "Inside Out 2",
    year: "2024",
    rating: "7.6",
    vote_average: 7.6,
    release_date: "2024-06-14",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    image: "/api/image/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    genres: ["Animation", "Comedy", "Family"],
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for unexpected new Emotions.",
    tagline: "Make room for new emotions.",
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    year: "2024",
    rating: "7.7",
    vote_average: 7.7,
    release_date: "2024-07-26",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    image: "/api/image/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    genres: ["Action", "Comedy", "Sci-Fi"],
    overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him.",
    tagline: "Come together.",
  },
];

export const ALL_CURATED_MOVIES = [
  ...FALLBACK_TRENDING,
  ...FALLBACK_NEW_RELEASES,
  {
    id: 603,
    title: "The Matrix",
    year: "1999",
    rating: "8.7",
    vote_average: 8.7,
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    image: "/api/image/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    genres: ["Action", "Sci-Fi"],
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast computer system.",
  },
  {
    id: 496243,
    title: "Parasite",
    year: "2019",
    rating: "8.5",
    vote_average: 8.5,
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    image: "/api/image/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    genres: ["Comedy", "Thriller", "Drama"],
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
  },
  {
    id: 680,
    title: "Pulp Fiction",
    year: "1994",
    rating: "8.9",
    vote_average: 8.9,
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    image: "/api/image/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    genres: ["Crime", "Drama", "Thriller"],
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in four tales of violence and redemption.",
  },
  {
    id: 120,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: "2001",
    rating: "8.9",
    vote_average: 8.9,
    poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cDK6.jpg",
    image: "/api/image/w500/6oom5QYQ2yQTMJIbnvbkBL9cDK6.jpg",
    genres: ["Adventure", "Fantasy", "Action"],
    overview: "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home behind to keep it from falling into the hands of its evil creator.",
  },
];
