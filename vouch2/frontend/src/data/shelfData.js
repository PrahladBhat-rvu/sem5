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
      media_type: "tv",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMjA5NjM3NTk1M15BMl5BanBnXkFtZTgwMzg1MzU2NjE@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMjA5NjM3NTk1M15BMl5BanBnXkFtZTgwMzg1MzU2NjE@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      genres: ["Comedy"],
      badge: "EPISODIC DIRECTOR",
      overview: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, tedium and romance.",
      director: "Greg Daniels",
    },
    {
      id: 226637,
      title: "High Potential",
      year: "2024",
      rating: "7.9",
      media_type: "tv",
      backdrop: "https://m.media-amazon.com/images/M/MV5BY2E2NzFiMTctYTE1MS00ZWEwLWFhMzctYzA0ODE1NDVmYzZiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BY2E2NzFiMTctYTE1MS00ZWEwLWFhMzctYzA0ODE1NDVmYzZiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      genres: ["Crime", "Drama"],
      badge: "DIRECTOR",
    },
    {
      id: 87428,
      title: "Why Women Kill",
      year: "2019",
      rating: "8.3",
      media_type: "tv",
      backdrop: "https://m.media-amazon.com/images/M/MV5BYzZjZDc3NTctMzZlNS00NjY4LTllMTMtMmZmNDc1ZjE0NjMyXkEyXkFqcGc@._V1_QL75_UX380_CR0,1,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BYzZjZDc3NTctMzZlNS00NjY4LTllMTMtMmZmNDc1ZjE0NjMyXkEyXkFqcGc@._V1_QL75_UX380_CR0,1,380,562_.jpg",
      genres: ["Comedy", "Drama"],
      badge: "DIRECTOR",
    },
    {
      id: 447273,
      title: "Snow White",
      year: "2025",
      rating: "7.4",
      backdrop: "https://upload.wikimedia.org/wikipedia/en/1/1f/Snow_White_%282025_film%29_final_poster.jpg",
      poster: "https://upload.wikimedia.org/wikipedia/en/1/1f/Snow_White_%282025_film%29_final_poster.jpg",
      genres: ["Fantasy", "Musical"],
      badge: "UPCOMING",
    },
    {
      id: 63161,
      title: "Crazy Ex-Girlfriend",
      year: "2015",
      rating: "7.8",
      media_type: "tv",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMjVjM2Y3YzctYzQwMi00OTY2LWEyMjMtODdkZmZiMWQxM2M4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMjVjM2Y3YzctYzQwMi00OTY2LWEyMjMtODdkZmZiMWQxM2M4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      genres: ["Comedy", "Musical"],
      badge: "DIRECTOR",
    },
    {
      id: 19913,
      title: "(500) Days of Summer",
      year: "2009",
      rating: "7.7",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMTk5MjM4OTU1OV5BMl5BanBnXkFtZTcwODkzNDIzMw@@._V1_QL75_UX380_CR0,12,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMTk5MjM4OTU1OV5BMl5BanBnXkFtZTcwODkzNDIzMw@@._V1_QL75_UX380_CR0,12,380,562_.jpg",
      genres: ["Comedy", "Romance", "Drama"],
      badge: "DIRECTOR",
    },
    {
      id: 1930,
      title: "The Amazing Spider-Man",
      year: "2012",
      rating: "7.0",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxNV5BMl5BanBnXkFtZTcwNjIyNzExOA@@._V1_QL75_UX380_CR0,1,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxNV5BMl5BanBnXkFtZTcwNjIyNzExOA@@._V1_QL75_UX380_CR0,1,380,562_.jpg",
      genres: ["Action", "Adventure", "Sci-Fi"],
      badge: "DIRECTOR",
    },
    {
      id: 400928,
      title: "Gifted",
      year: "2017",
      rating: "7.6",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMjQ2NDU3NDE0M15BMl5BanBnXkFtZTgwMjA3OTg0MDI@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMjQ2NDU3NDE0M15BMl5BanBnXkFtZTgwMjA3OTg0MDI@._V1_QL75_UX380_CR0,0,380,562_.jpg",
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
      backdrop: "https://m.media-amazon.com/images/M/MV5BMmFiZGZjMmEtMTA0Ni00MzA2LTljMTYtZGI2MGJmZWYzZTQ2XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMmFiZGZjMmEtMTA0Ni00MzA2LTljMTYtZGI2MGJmZWYzZTQ2XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      genres: ["Action", "Sci-Fi"],
      badge: "PETER PARKER",
    },
    {
      id: 57243,
      title: "Doctor Who",
      year: "2007",
      rating: "8.6",
      media_type: "tv",
      backdrop: "https://m.media-amazon.com/images/M/MV5BZjE4OTRkMTktNTdmNS00MTFhLTljZTItOWI3Y2UyZTYyMWRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BZjE4OTRkMTktNTdmNS00MTFhLTljZTItOWI3Y2UyZTYyMWRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      genres: ["Sci-Fi", "Adventure"],
      badge: "GUEST STAR",
    },
    {
      id: 324786,
      title: "Hacksaw Ridge",
      year: "2016",
      rating: "8.1",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMjQ1NjM3MTUxNV5BMl5BanBnXkFtZTgwMDc5MTY5OTE@._V1_QL75_UX380_CR0,12,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMjQ1NjM3MTUxNV5BMl5BanBnXkFtZTgwMDc5MTY5OTE@._V1_QL75_UX380_CR0,12,380,562_.jpg",
      genres: ["Drama", "War"],
      badge: "LEAD ACTOR",
    },
    {
      id: 37799,
      title: "The Social Network",
      year: "2010",
      rating: "7.8",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMjlkNTE5ZTUtNGEwNy00MGVhLThmZjMtZjU1NDE5Zjk1NDZkXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMjlkNTE5ZTUtNGEwNy00MGVhLThmZjMtZjU1NDE5Zjk1NDZkXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      genres: ["Drama", "Biography"],
      badge: "EDUARDO SAVERIN",
    },
    {
      id: 537116,
      title: "tick, tick... BOOM!",
      year: "2021",
      rating: "7.5",
      backdrop: "https://m.media-amazon.com/images/M/MV5BOGYyNGJmNzctYzZjZi00MzUzLTg3YTYtYjk0OTNjMzA1OTE4XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BOGYyNGJmNzctYzZjZi00MzUzLTg3YTYtYjk0OTNjMzA1OTE4XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      genres: ["Drama", "Musical"],
      badge: "JONATHAN LARSON",
    },
    {
      id: 1930,
      title: "The Amazing Spider-Man",
      year: "2012",
      rating: "7.0",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxNV5BMl5BanBnXkFtZTcwNjIyNzExOA@@._V1_QL75_UX380_CR0,1,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxNV5BMl5BanBnXkFtZTcwNjIyNzExOA@@._V1_QL75_UX380_CR0,1,380,562_.jpg",
      genres: ["Action", "Adventure"],
      badge: "PETER PARKER",
    },
    {
      id: 2919,
      title: "The Tonight Show",
      year: "2021",
      rating: "7.2",
      media_type: "tv",
      backdrop: "https://m.media-amazon.com/images/M/MV5BYzA4ZjFhYjgtZWVjZi00YmU3LTg4NzMtZjMxMGU4MTA0YTBjXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BYzA4ZjFhYjgtZWVjZi00YmU3LTg4NzMtZjMxMGU4MTA0YTBjXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      genres: ["Talk Show", "Comedy"],
      badge: "SPECIAL GUEST",
    },
    {
      id: 2912,
      title: "Jeopardy!",
      year: "2021",
      rating: "8.0",
      media_type: "tv",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMjM1NjQ1YzUtZDFhMS00MDRkLWIwODMtOWIxOGUwZTA1MTgxXkEyXkFqcGc@._V1_QL75_UY562_CR21,0,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMjM1NjQ1YzUtZDFhMS00MDRkLWIwODMtOWIxOGUwZTA1MTgxXkEyXkFqcGc@._V1_QL75_UY562_CR21,0,380,562_.jpg",
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
      backdrop: "https://m.media-amazon.com/images/M/MV5BM2Y0YmM5MWYtZTYzNi00ZjU5LTlmOGYtZDQ4ODQyMjAzNjQ2XkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BM2Y0YmM5MWYtZTYzNi00ZjU5LTlmOGYtZDQ4ODQyMjAzNjQ2XkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg",
      genres: ["Drama", "Mystery"],
      badge: "DIRECTOR",
    },
    {
      id: 77,
      title: "Memento",
      year: "2000",
      rating: "8.4",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMGQ3Y2Q4NjktN2E4Ny00Y2Q2LTliZDUtZTNiNjRhY2I0NGIyXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMGQ3Y2Q4NjktN2E4Ny00Y2Q2LTliZDUtZTNiNjRhY2I0NGIyXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
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
      backdrop: "https://m.media-amazon.com/images/M/MV5BMjA5NjM3NTk1M15BMl5BanBnXkFtZTgwMzg1MzU2NjE@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMjA5NjM3NTk1M15BMl5BanBnXkFtZTgwMzg1MzU2NjE@._V1_QL75_UX380_CR0,4,380,562_.jpg",
      genres: ["Crime", "Drama"],
      badge: "DIRECTOR",
    },
    {
      id: 146233,
      title: "Prisoners",
      year: "2013",
      rating: "8.1",
      backdrop: "https://m.media-amazon.com/images/M/MV5BMTg0NTIzMjQ1NV5BMl5BanBnXkFtZTcwNDc3MzM5OQ@@._V1_QL75_UY562_CR0,0,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BMTg0NTIzMjQ1NV5BMl5BanBnXkFtZTcwNDc3MzM5OQ@@._V1_QL75_UY562_CR0,0,380,562_.jpg",
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
      media_type: "tv",
      backdrop: "/api/image/w780/wiE9doxiLwq3WCGamDIOb2PqBqc.jpg",
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
      backdrop: "https://m.media-amazon.com/images/M/MV5BM2Y1N2ZhNjctYjVhZC00MDg2LWFhNTItMzI3ZjAwZDhjYmFiXkEyXkFqcGc@._V1_QL75_UY562_CR35,0,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BM2Y1N2ZhNjctYjVhZC00MDg2LWFhNTItMzI3ZjAwZDhjYmFiXkEyXkFqcGc@._V1_QL75_UY562_CR35,0,380,562_.jpg",
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
      backdrop: "https://m.media-amazon.com/images/M/MV5BNDk3NTEwNjc0MV5BMl5BanBnXkFtZTgwNzYxNTMwMzI@._V1_QL75_UX380_CR0,0,380,562_.jpg",
      poster: "https://m.media-amazon.com/images/M/MV5BNDk3NTEwNjc0MV5BMl5BanBnXkFtZTgwNzYxNTMwMzI@._V1_QL75_UX380_CR0,0,380,562_.jpg",
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

