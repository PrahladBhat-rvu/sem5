// Landscape movie shelf catalog and helper functions
// Supporting streaming-platform style 16:9 carousels (Apple TV / Netflix style)

export const CURATED_SHELVES = {
  // MARC WEBB (Exact match to reference image row 1)
  "Marc Webb": [
    {
      id: 2316,
      title: "The Office",
      year: "2005",
      rating: "9.0",
      backdrop: "/api/image/w780/7k0d53zYkF4qK3GfT98d9c2Uq9g.jpg",
      poster: "/api/image/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg",
      genres: ["Comedy"],
      badge: "EPISODIC DIRECTOR",
    },
    {
      id: 238234,
      title: "High Potential",
      year: "2024",
      rating: "7.9",
      backdrop: "/api/image/w780/9T7v2CeqwWfE6xLsmjAov3QxS2Z.jpg",
      poster: "/api/image/w500/tLw0tX1B4p7uYf1I0D1i9Y3v9a.jpg",
      genres: ["Crime", "Drama"],
      badge: "DIRECTOR",
    },
    {
      id: 88785,
      title: "Why Women Kill",
      year: "2019",
      rating: "8.3",
      backdrop: "/api/image/w780/3q0Y8e2oO7vL6wKxH1h6A9Q2f4m.jpg",
      poster: "/api/image/w500/uF6v0iZ3a6J3k2W1t6Q9v4b8N.jpg",
      genres: ["Comedy", "Drama"],
      badge: "DIRECTOR",
    },
    {
      id: 572802,
      title: "Snow White",
      year: "2025",
      rating: "7.4",
      backdrop: "/api/image/w780/m1D87wU5N6k3bLz5T8Q6xW7oP4t.jpg",
      poster: "/api/image/w500/aKxN8Y3d7p1r9t4o0e5w6u7i.jpg",
      genres: ["Fantasy", "Musical"],
      badge: "UPCOMING",
    },
    {
      id: 63688,
      title: "Crazy Ex-Girlfriend",
      year: "2015",
      rating: "7.8",
      backdrop: "/api/image/w780/a2Y9n9k3XkL5n6W7v8Q9x0P4a1b.jpg",
      poster: "/api/image/w500/kP9s1r7n2b4m3v5x8z0w.jpg",
      genres: ["Comedy", "Musical"],
      badge: "DIRECTOR",
    },
    {
      id: 19913,
      title: "(500) Days of Summer",
      year: "2009",
      rating: "7.7",
      backdrop: "/api/image/w780/8xV8R4yqXyq7d4c0kP9L6M2w3v.jpg",
      poster: "/api/image/w500/f9mbqqVG7Es5ir7lPtKXEv9uvE.jpg",
      genres: ["Comedy", "Romance", "Drama"],
      badge: "DIRECTOR",
    },
    {
      id: 1930,
      title: "The Amazing Spider-Man",
      year: "2012",
      rating: "7.0",
      backdrop: "/api/image/w780/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
      poster: "/api/image/w500/dQ8g5v3kY9p4f8u7w1m6z2a4.jpg",
      genres: ["Action", "Adventure", "Sci-Fi"],
      badge: "DIRECTOR",
    },
    {
      id: 400928,
      title: "Gifted",
      year: "2017",
      rating: "7.6",
      backdrop: "/api/image/w780/4v7J8c9s8V8n6M5v4b3N2m1L0k.jpg",
      poster: "/api/image/w500/9SemBv0v6u9o0x1v7m.jpg",
      genres: ["Drama"],
      badge: "DIRECTOR",
    },
  ],

  // ANDREW GARFIELD (Exact match to reference image row 2)
  "Andrew Garfield": [
    {
      id: 634649,
      title: "Spider-Man: No Way Home",
      year: "2021",
      rating: "8.2",
      backdrop: "/api/image/w780/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
      poster: "/api/image/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      genres: ["Action", "Sci-Fi"],
      badge: "PETER PARKER",
    },
    {
      id: 57243,
      title: "Doctor Who",
      year: "2007",
      rating: "8.6",
      backdrop: "/api/image/w780/8Bve8yK5PzXJc7rXQ2Jc9e4Vz5a.jpg",
      poster: "/api/image/w500/sz4zFMB29IRqlNnvVMGAp9X2iFm.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "GUEST STAR",
    },
    {
      id: 324786,
      title: "Hacksaw Ridge",
      year: "2016",
      rating: "8.1",
      backdrop: "/api/image/w780/wVOo60f38v06t0t7d4L7J5dF2lM.jpg",
      poster: "/api/image/w500/6vkhRpHm0NoqogRpnZq5p7Kx.jpg",
      genres: ["Drama", "War"],
      badge: "LEAD ACTOR",
    },
    {
      id: 37799,
      title: "The Social Network",
      year: "2010",
      rating: "7.8",
      backdrop: "/api/image/w780/5YgtmR2K8o1B2aFp9e8b7V6n1m.jpg",
      poster: "/api/image/w500/n0ybibav2IK2dQOqSZ3t9N8eI2m.jpg",
      genres: ["Drama", "Biography"],
      badge: "EDUARDO SAVERIN",
    },
    {
      id: 537116,
      title: "tick, tick... BOOM!",
      year: "2021",
      rating: "7.5",
      backdrop: "/api/image/w780/e38m6K0cRz7e3s6Q1fS8CjD5K0c.jpg",
      poster: "/api/image/w500/DPv1g1g4J3NfX2s4p1k8.jpg",
      genres: ["Drama", "Musical"],
      badge: "JONATHAN LARSON",
    },
    {
      id: 1930,
      title: "The Amazing Spider-Man",
      year: "2012",
      rating: "7.0",
      backdrop: "/api/image/w780/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
      poster: "/api/image/w500/dQ8g5v3kY9p4f8u7w1m6z2a4.jpg",
      genres: ["Action", "Adventure"],
      badge: "PETER PARKER",
    },
    {
      id: 2919,
      title: "The Tonight Show",
      year: "2021",
      rating: "7.2",
      backdrop: "/api/image/w780/w1mY4zO0hG7rWkP5sB9vL3c8T2e.jpg",
      poster: "/api/image/w500/1rWkM6n0Y8q3b5c.jpg",
      genres: ["Talk Show", "Comedy"],
      badge: "SPECIAL GUEST",
    },
    {
      id: 2912,
      title: "Jeopardy!",
      year: "2021",
      rating: "8.0",
      backdrop: "/api/image/w780/7hH9k8F7s6L4p2N9v5G3w1B8d2a.jpg",
      poster: "/api/image/w500/jE0P1A2R3D4Y5.jpg",
      genres: ["Game Show"],
      badge: "CELEBRITY APPEARANCE",
    },
  ],

  // CHRISTOPHER NOLAN
  "Christopher Nolan": [
    {
      id: 872585,
      title: "Oppenheimer",
      year: "2023",
      rating: "8.9",
      backdrop: "/api/image/w780/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
      poster: "/api/image/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      genres: ["Drama", "History"],
      badge: "DIRECTOR",
    },
    {
      id: 157336,
      title: "Interstellar",
      year: "2014",
      rating: "8.7",
      backdrop: "/api/image/w780/xJHokMbljvjADYDit5fK5VQsXEG.jpg",
      poster: "/api/image/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "DIRECTOR",
    },
    {
      id: 155,
      title: "The Dark Knight",
      year: "2008",
      rating: "9.0",
      backdrop: "/api/image/w780/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      poster: "/api/image/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      genres: ["Action", "Crime"],
      badge: "DIRECTOR",
    },
    {
      id: 27205,
      title: "Inception",
      year: "2010",
      rating: "8.8",
      backdrop: "/api/image/w780/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
      poster: "/api/image/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      genres: ["Action", "Sci-Fi"],
      badge: "DIRECTOR",
    },
    {
      id: 577922,
      title: "Tenet",
      year: "2020",
      rating: "7.5",
      backdrop: "/api/image/w780/wzJRB4MKi3yK138bEYvNG2vMyY9.jpg",
      poster: "/api/image/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
      genres: ["Action", "Sci-Fi"],
      badge: "DIRECTOR",
    },
    {
      id: 374720,
      title: "Dunkirk",
      year: "2017",
      rating: "7.9",
      backdrop: "/api/image/w780/bOXBV303FgmKu2ea9g9x9E8u2L.jpg",
      poster: "/api/image/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg",
      genres: ["War", "Action"],
      badge: "DIRECTOR",
    },
    {
      id: 1124,
      title: "The Prestige",
      year: "2006",
      rating: "8.5",
      backdrop: "/api/image/w780/3wz3W4l1wP0bL4R9v8T2y1u9.jpg",
      poster: "/api/image/w500/5lytXF0v5m6L8bK4t.jpg",
      genres: ["Drama", "Mystery"],
      badge: "DIRECTOR",
    },
    {
      id: 77,
      title: "Memento",
      year: "2000",
      rating: "8.4",
      backdrop: "/api/image/w780/7kP0bL4R9v8T2y1u9.jpg",
      poster: "/api/image/w500/yuNs09hvpHvu197829871.jpg",
      genres: ["Mystery", "Thriller"],
      badge: "DIRECTOR",
    },
  ],

  // DENIS VILLENEUVE
  "Denis Villeneuve": [
    {
      id: 693134,
      title: "Dune: Part Two",
      year: "2024",
      rating: "8.6",
      backdrop: "/api/image/w780/xOMo8BRK7PfcJv9JCnx7s520dQq.jpg",
      poster: "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "DIRECTOR",
    },
    {
      id: 438631,
      title: "Dune",
      year: "2021",
      rating: "8.0",
      backdrop: "/api/image/w780/lzWHmY2Bw233g86wVqF3t972173.jpg",
      poster: "/api/image/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "DIRECTOR",
    },
    {
      id: 335984,
      title: "Blade Runner 2049",
      year: "2017",
      rating: "8.0",
      backdrop: "/api/image/w780/ilRyAZwN105q9v2k3tP7T2a4L3e.jpg",
      poster: "/api/image/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
      genres: ["Sci-Fi", "Mystery"],
      badge: "DIRECTOR",
    },
    {
      id: 329865,
      title: "Arrival",
      year: "2016",
      rating: "7.9",
      backdrop: "/api/image/w780/yIZ1xendyqKvY37noBP20GUx0um.jpg",
      poster: "/api/image/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
      genres: ["Sci-Fi", "Drama"],
      badge: "DIRECTOR",
    },
    {
      id: 273481,
      title: "Sicario",
      year: "2015",
      rating: "7.6",
      backdrop: "/api/image/w780/6xKzbikH4L4xG0WjN5K1v7t2P9.jpg",
      poster: "/api/image/w500/si760s3a6p7d5s4f3.jpg",
      genres: ["Crime", "Drama"],
      badge: "DIRECTOR",
    },
    {
      id: 146233,
      title: "Prisoners",
      year: "2013",
      rating: "8.1",
      backdrop: "/api/image/w780/m9f3K8L0v5b7N2a1c4D6e8.jpg",
      poster: "/api/image/w500/tuZhZ6LHxrgw797.jpg",
      genres: ["Crime", "Drama"],
      badge: "DIRECTOR",
    },
  ],

  // CILLIAN MURPHY
  "Cillian Murphy": [
    {
      id: 872585,
      title: "Oppenheimer",
      year: "2023",
      rating: "8.9",
      backdrop: "/api/image/w780/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
      poster: "/api/image/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      genres: ["Drama", "History"],
      badge: "J. ROBERT OPPENHEIMER",
    },
    {
      id: 60574,
      title: "Peaky Blinders",
      year: "2013",
      rating: "8.8",
      backdrop: "/api/image/w780/7k0d53zYkF4qK3GfT98d9c2Uq9g.jpg",
      poster: "/api/image/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
      genres: ["Drama", "Crime"],
      badge: "THOMAS SHELBY",
    },
    {
      id: 27205,
      title: "Inception",
      year: "2010",
      rating: "8.8",
      backdrop: "/api/image/w780/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
      poster: "/api/image/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      genres: ["Action", "Sci-Fi"],
      badge: "ROBERT FISCHER",
    },
    {
      id: 374720,
      title: "Dunkirk",
      year: "2017",
      rating: "7.9",
      backdrop: "/api/image/w780/bOXBV303FgmKu2ea9g9x9E8u2L.jpg",
      poster: "/api/image/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg",
      genres: ["War", "Drama"],
      badge: "SHIVERING SOLDIER",
    },
    {
      id: 155,
      title: "The Dark Knight",
      year: "2008",
      rating: "9.0",
      backdrop: "/api/image/w780/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      poster: "/api/image/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      genres: ["Action", "Crime"],
      badge: "DR. JONATHAN CRANE",
    },
  ],

  // TIMOTHÉE CHALAMET
  "Timothée Chalamet": [
    {
      id: 693134,
      title: "Dune: Part Two",
      year: "2024",
      rating: "8.6",
      backdrop: "/api/image/w780/xOMo8BRK7PfcJv9JCnx7s520dQq.jpg",
      poster: "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "PAUL ATREIDES",
    },
    {
      id: 787699,
      title: "Wonka",
      year: "2023",
      rating: "7.1",
      backdrop: "/api/image/w780/yOm99vFLhkPcys32vdOlLRIJ9ik.jpg",
      poster: "/api/image/w500/qhb1qYHeY9781682.jpg",
      genres: ["Comedy", "Family"],
      badge: "WILLY WONKA",
    },
    {
      id: 438631,
      title: "Dune",
      year: "2021",
      rating: "8.0",
      backdrop: "/api/image/w780/lzWHmY2Bw233g86wVqF3t972173.jpg",
      poster: "/api/image/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "PAUL ATREIDES",
    },
    {
      id: 157336,
      title: "Interstellar",
      year: "2014",
      rating: "8.7",
      backdrop: "/api/image/w780/xJHokMbljvjADYDit5fK5VQsXEG.jpg",
      poster: "/api/image/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "YOUNG TOM",
    },
    {
      id: 398818,
      title: "Call Me by Your Name",
      year: "2017",
      rating: "7.9",
      backdrop: "/api/image/w780/ctMserH8g2SeOAnCw5gFjd2NTLq.jpg",
      poster: "/api/image/w500/tcN1Sp2k9p781682.jpg",
      genres: ["Romance", "Drama"],
      badge: "ELIO PERLMAN",
    },
  ],

  // TRENDING MASTERPIECES (Always available fallback shelf)
  "Trending Masterpieces": [
    {
      id: 693134,
      title: "Dune: Part Two",
      year: "2024",
      rating: "8.6",
      backdrop: "/api/image/w780/xOMo8BRK7PfcJv9JCnx7s520dQq.jpg",
      poster: "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "CONSENSUS VOUCH",
    },
    {
      id: 872585,
      title: "Oppenheimer",
      year: "2023",
      rating: "8.9",
      backdrop: "/api/image/w780/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
      poster: "/api/image/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      genres: ["Drama", "History"],
      badge: "BEST PICTURE",
    },
    {
      id: 157336,
      title: "Interstellar",
      year: "2014",
      rating: "8.7",
      backdrop: "/api/image/w780/xJHokMbljvjADYDit5fK5VQsXEG.jpg",
      poster: "/api/image/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "MUST WATCH",
    },
    {
      id: 155,
      title: "The Dark Knight",
      year: "2008",
      rating: "9.0",
      backdrop: "/api/image/w780/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      poster: "/api/image/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      genres: ["Action", "Crime"],
      badge: "ALL TIME TOP 10",
    },
    {
      id: 27205,
      title: "Inception",
      year: "2010",
      rating: "8.8",
      backdrop: "/api/image/w780/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
      poster: "/api/image/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      genres: ["Action", "Sci-Fi"],
      badge: "MIND BENDING",
    },
    {
      id: 792307,
      title: "Poor Things",
      year: "2023",
      rating: "7.8",
      backdrop: "/api/image/w780/bQS53L08W0mZoxz6V0e0iHn4RjU.jpg",
      poster: "/api/image/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
      genres: ["Comedy", "Sci-Fi"],
      badge: "ACCLAIMED",
    },
    {
      id: 937287,
      title: "Challengers",
      year: "2024",
      rating: "7.5",
      backdrop: "/api/image/w780/fY3lD2jM6AoE39gE3259n87vBtk.jpg",
      poster: "/api/image/w500/H6vke7zGiuL7z4v0MG49aKnKVm.jpg",
      genres: ["Drama", "Romance"],
      badge: "FAN FAVORITE",
    },
    {
      id: 569094,
      title: "Across the Spider-Verse",
      year: "2023",
      rating: "8.6",
      backdrop: "/api/image/w780/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
      poster: "/api/image/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      genres: ["Animation", "Action"],
      badge: "VISUAL TRIUMPH",
    },
  ],
};

/**
 * Resolves shelves tailored for a specific movie:
 * 1. "More from [Director]"
 * 2. "Starring [Lead Actor]"
 * 3. Additional curated shelf
 */
export function getShelvesForMovie(movie) {
  const shelves = [];

  // 1. Director Shelf
  const rawDirector = movie?.Director || movie?.director || "";
  let matchedDirector = null;
  for (const name of Object.keys(CURATED_SHELVES)) {
    if (rawDirector.toLowerCase().includes(name.toLowerCase())) {
      matchedDirector = name;
      break;
    }
  }

  if (matchedDirector && CURATED_SHELVES[matchedDirector]) {
    shelves.push({
      id: `director-${matchedDirector.toLowerCase().replace(/\s+/g, "-")}`,
      title: `More from ${matchedDirector}`,
      exploreLink: `/search?q=${encodeURIComponent(matchedDirector)}`,
      movies: CURATED_SHELVES[matchedDirector].filter((m) => String(m.id) !== String(movie?.id)),
    });
  } else if (rawDirector && rawDirector !== "N/A" && rawDirector !== "Unknown") {
    const firstDirector = rawDirector.split(",")[0].trim();
    shelves.push({
      id: `director-${firstDirector.toLowerCase().replace(/\s+/g, "-")}`,
      title: `More from ${firstDirector}`,
      exploreLink: `/search?q=${encodeURIComponent(firstDirector)}`,
      movies: CURATED_SHELVES["Trending Masterpieces"],
    });
  } else {
    // Default to Marc Webb or Christopher Nolan as in the reference image
    shelves.push({
      id: "director-marc-webb",
      title: "More from Marc Webb",
      exploreLink: `/search?q=Marc+Webb`,
      movies: CURATED_SHELVES["Marc Webb"],
    });
  }

  // 2. Starring / Actor Shelf
  const rawActors = movie?.Actors || (movie?.credits?.cast?.[0]?.name) || "";
  let matchedActor = null;
  for (const name of Object.keys(CURATED_SHELVES)) {
    if (rawActors.toLowerCase().includes(name.toLowerCase())) {
      matchedActor = name;
      break;
    }
  }

  if (matchedActor && CURATED_SHELVES[matchedActor]) {
    shelves.push({
      id: `actor-${matchedActor.toLowerCase().replace(/\s+/g, "-")}`,
      title: `Starring ${matchedActor}`,
      exploreLink: `/search?q=${encodeURIComponent(matchedActor)}`,
      movies: CURATED_SHELVES[matchedActor].filter((m) => String(m.id) !== String(movie?.id)),
    });
  } else if (rawActors && rawActors !== "N/A") {
    const firstActor = rawActors.split(",")[0].trim();
    shelves.push({
      id: `actor-${firstActor.toLowerCase().replace(/\s+/g, "-")}`,
      title: `Starring ${firstActor}`,
      exploreLink: `/search?q=${encodeURIComponent(firstActor)}`,
      movies: CURATED_SHELVES["Andrew Garfield"],
    });
  } else {
    shelves.push({
      id: "actor-andrew-garfield",
      title: "Starring Andrew Garfield",
      exploreLink: `/search?q=Andrew+Garfield`,
      movies: CURATED_SHELVES["Andrew Garfield"],
    });
  }

  return shelves;
}

