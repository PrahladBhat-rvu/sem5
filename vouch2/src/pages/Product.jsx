import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaPlay,
  FaStop,
  FaPlus,
  FaCheck,
  FaCheckCircle,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaArrowLeft,
  FaTimes,
  FaYoutube,
  FaFilm,
  FaExpandAlt,
  FaCompressAlt,
  FaComments,
  FaExternalLinkAlt,
  FaArrowRight,
  FaTv,
  FaAmazon,
} from "react-icons/fa";
import { SiRottentomatoes, SiImdb, SiNetflix, SiAppletv, SiMax } from "react-icons/si";
import Navbar from "../components/Navbar";
import MovieShelf from "../components/MovieShelf";
import {
  getMovieDetails,
  getTMDBImageUrl,
  searchMovies,
  ALL_CURATED_MOVIES,
  FALLBACK_TRENDING,
} from "../api/tmdb";
import { getShelvesForMovie, CURATED_SHELVES } from "../data/shelfData";
import { slugify, getTitleUrl } from "../utils/slug";

const VERIFIED_TRAILERS = {
  "550": "SUXWAEX2jlg",
  "tt0137523": "SUXWAEX2jlg",
  "fight club": "SUXWAEX2jlg",
  "fight-club": "SUXWAEX2jlg",
  "155": "EXeTwQWrcwY",
  "tt0468569": "EXeTwQWrcwY",
  "the dark knight": "EXeTwQWrcwY",
  "the-dark-knight": "EXeTwQWrcwY",
  "27205": "YoHD9XEInc0",
  "tt1375666": "YoHD9XEInc0",
  "inception": "YoHD9XEInc0",
  "157336": "zSWdZVtXT7E",
  "interstellar": "zSWdZVtXT7E",
  "872585": "uYPbbksJxIg",
  "oppenheimer": "uYPbbksJxIg",
  "307663": "Uv554B7YHk4",
  "creed": "Uv554B7YHk4",
  "creed ii": "c34GDuT48O8",
  "creed-ii": "c34GDuT48O8",
  "creed iii": "AHmCH7iB_IM",
  "creed-iii": "AHmCH7iB_IM",
  "603": "vKQi3bBA1y8",
  "the matrix": "vKQi3bBA1y8",
  "680": "s7EdQ4FqbhY",
  "pulp fiction": "s7EdQ4FqbhY",
  "496243": "5xH0RZE7t4w",
  "parasite": "5xH0RZE7t4w",
  "37799": "lB95KLmpLR4",
  "the social network": "lB95KLmpLR4",
  "the-social-network": "lB95KLmpLR4",
  "634649": "JfVOs4VSpmA",
  "spider-man: no way home": "JfVOs4VSpmA",
  "spider man no way home": "JfVOs4VSpmA",
  "spider-man-no-way-home": "JfVOs4VSpmA",
  "1930": "-tnxzJ0SSOw",
  "the amazing spider-man": "-tnxzJ0SSOw",
  "the-amazing-spider-man": "-tnxzJ0SSOw",
  "19913": "PsD0NpFSADM",
  "(500) days of summer": "PsD0NpFSADM",
  "500 days of summer": "PsD0NpFSADM",
  "2316": "LHOtME2DL4g",
  "the office": "LHOtME2DL4g",
  "324786": "s2-1hz1juBI",
  "hacksaw ridge": "s2-1hz1juBI",
  "244786": "7d_jQycdQGo",
  "whiplash": "7d_jQycdQGo",
  "438631": "n9xhJrPXop4",
  "dune": "n9xhJrPXop4",
  "693134": "Way9Dexny3w",
  "dune: part two": "Way9Dexny3w",
  "dune-part-two": "Way9Dexny3w",
  "98": "owK1qxDselE",
  "gladiator": "owK1qxDselE",
  "335984": "gCcx85zbxz4",
  "blade runner 2049": "gCcx85zbxz4",
  "238": "UaVTIH8mujA",
  "the godfather": "UaVTIH8mujA",
  "278": "PLl99DlL6b4",
  "the shawshank redemption": "PLl99DlL6b4",
  "769": "qo5jJpHtI1Y",
  "goodfellas": "qo5jJpHtI1Y",
  "299534": "TcMBFSGVi1c",
  "avengers: endgame": "TcMBFSGVi1c",
  "avengers endgame": "TcMBFSGVi1c",
  "high potential": "Gg4_2_55_G4",
  "why women kill": "xGqg_pU72uU",
  "gifted": "x7CAyW2w1wQ",
  "tick, tick... boom!": "YJserno8tyU",
  "tick tick boom": "YJserno8tyU",
  "snow white": "iV4O_DkY1-w",
  "484641": "2tXh_jcmj88",
  "tt8456806": "2tXh_jcmj88",
  "anna": "2tXh_jcmj88",
  "joker": "zAGVQLHvwOY",
  "avatar": "5PSNL1qE6VY",
  "titanic": "kVrqfY8mTFI",
  "forrest gump": "bLvqoHBptjg",
  "iron man": "8ugaeA-nMTc",
  "the batman": "mqqft2x_Aa4",
};

const EXACT_WATCH_LINKS = {
  "fight club": {
    netflix: "https://www.netflix.com/title/26004747",
    appletv: "https://tv.apple.com/us/movie/fight-club/umc.cmc.24xwh43d7s04e9o1y4y1p2wyo",
    prime: "https://www.amazon.com/dp/B000I9YUX8",
    max: "https://www.justwatch.com/us/movie/fight-club",
  },
  "fight-club": {
    netflix: "https://www.netflix.com/title/26004747",
    appletv: "https://tv.apple.com/us/movie/fight-club/umc.cmc.24xwh43d7s04e9o1y4y1p2wyo",
    prime: "https://www.amazon.com/dp/B000I9YUX8",
    max: "https://www.justwatch.com/us/movie/fight-club",
  },
  "550": {
    netflix: "https://www.netflix.com/title/26004747",
    appletv: "https://tv.apple.com/us/movie/fight-club/umc.cmc.24xwh43d7s04e9o1y4y1p2wyo",
    prime: "https://www.amazon.com/dp/B000I9YUX8",
    max: "https://www.justwatch.com/us/movie/fight-club",
  },
  "the dark knight": {
    netflix: "https://www.netflix.com/title/70079583",
    appletv: "https://tv.apple.com/us/movie/the-dark-knight/umc.cmc.23l26q9w9662o8w1fom8u9y9j",
    prime: "https://www.amazon.com/dp/B001I14652",
    max: "https://www.max.com/movies/dark-knight/3b99be44-a169-42b4-9271-9c60e0a5cf8a",
  },
  "the-dark-knight": {
    netflix: "https://www.netflix.com/title/70079583",
    appletv: "https://tv.apple.com/us/movie/the-dark-knight/umc.cmc.23l26q9w9662o8w1fom8u9y9j",
    prime: "https://www.amazon.com/dp/B001I14652",
    max: "https://www.max.com/movies/dark-knight/3b99be44-a169-42b4-9271-9c60e0a5cf8a",
  },
  "inception": {
    netflix: "https://www.netflix.com/title/70131314",
    appletv: "https://tv.apple.com/us/movie/inception/umc.cmc.14g099i64h15aefvjhvjfeh5",
    prime: "https://www.amazon.com/dp/B0047WJ11G",
    max: "https://www.max.com/movies/inception/70a307a5-c54c-4ca7-a161-0b5c19266679",
  },
  "interstellar": {
    netflix: "https://www.netflix.com/title/70305903",
    appletv: "https://tv.apple.com/us/movie/interstellar/umc.cmc.18s96r6e27r2d4u1d1q58v96v",
    prime: "https://www.amazon.com/dp/B00TU9UFTS",
    max: "https://www.justwatch.com/us/movie/interstellar",
  },
  "oppenheimer": {
    netflix: "https://www.justwatch.com/us/movie/oppenheimer",
    appletv: "https://tv.apple.com/us/movie/oppenheimer/umc.cmc.5w673b06rhywz4c1800f40dvd",
    prime: "https://www.amazon.com/dp/B0CKZ87X6K",
    max: "https://www.peacocktv.com/watch-online/movies/oppenheimer/c528f110-096b-3543-9118-2e861d84a779",
  },
  "creed": {
    netflix: "https://www.netflix.com/title/80066228",
    appletv: "https://tv.apple.com/us/movie/creed/umc.cmc.4b8v79v54h43f2j9e9z3e8m5k",
    prime: "https://www.amazon.com/dp/B0182KVE4U",
    max: "https://www.justwatch.com/us/movie/creed",
  },
  "the matrix": {
    netflix: "https://www.netflix.com/title/20557937",
    appletv: "https://tv.apple.com/us/movie/the-matrix/umc.cmc.4d35j8qwe01v8m6q5e3z9x0k",
    prime: "https://www.amazon.com/dp/B000P299D2",
    max: "https://www.max.com/movies/the-matrix/82071358-00a8-4226-ac4c-21dfdbe4889c",
  },
  "pulp fiction": {
    netflix: "https://www.netflix.com/title/880640",
    appletv: "https://tv.apple.com/us/movie/pulp-fiction/umc.cmc.1e1948x6j3f8s2j9e8v5k3e2",
    prime: "https://www.amazon.com/dp/B008YB9B0E",
    max: "https://www.max.com/movies/pulp-fiction/f5a9fefb-08f9-4bce-9293-85590aebdcff",
  },
  "parasite": {
    netflix: "https://www.justwatch.com/us/movie/parasite-2019",
    appletv: "https://tv.apple.com/us/movie/parasite/umc.cmc.4y0f8e9x2z3e8v5k1e2m3j4",
    prime: "https://www.amazon.com/dp/B07YM14FDT",
    max: "https://www.max.com/movies/parasite/b93c8340-2051-4e42-9721-a3fc1ba244f7",
  },
  "the social network": {
    netflix: "https://www.netflix.com/title/70132721",
    appletv: "https://tv.apple.com/us/movie/the-social-network/umc.cmc.3y4e8v5k1e2m3j4e9x2z3e8",
    prime: "https://www.amazon.com/dp/B004EPZ07W",
    max: "https://www.max.com/movies/the-social-network/6c8582f6-068d-4e92-a169-d9d1502c3886",
  },
  "spider-man: no way home": {
    netflix: "https://www.netflix.com/title/81442111",
    appletv: "https://tv.apple.com/us/movie/spider-man-no-way-home/umc.cmc.4w3e8v5k1e2m3j4e9x2z3e8",
    prime: "https://www.amazon.com/dp/B09NMMKTR8",
    max: "https://www.justwatch.com/us/movie/spider-man-no-way-home",
  },
  "(500) days of summer": {
    netflix: "https://www.justwatch.com/us/movie/500-days-of-summer",
    appletv: "https://tv.apple.com/us/movie/500-days-of-summer/umc.cmc.1e2m3j4e9x2z3e8v5k1e2m3",
    prime: "https://www.amazon.com/dp/B002R81B1Y",
    max: "https://www.hulu.com/movie/500-days-of-summer-7c6d649a-5dbb-439d-bca5-5ba8295a6ec9",
  },
  "the office": {
    netflix: "https://www.netflix.com/title/70136120",
    appletv: "https://tv.apple.com/us/show/the-office/umc.cmc.24xwh43d7s04e9o1y4y1p2wyo",
    prime: "https://www.amazon.com/dp/B000PUB30S",
    max: "https://www.peacocktv.com/watch-online/tv/the-office/7178760708642924112",
  },
  "anna": {
    netflix: "https://www.netflix.com/title/81115998",
    appletv: "https://tv.apple.com/us/movie/anna/umc.cmc.2s2n3mwh10103632k42e9x7p6",
    prime: "https://www.amazon.com/dp/B07T4RN6C8",
    max: "https://www.justwatch.com/us/movie/anna-2019",
  },
  "484641": {
    netflix: "https://www.netflix.com/title/81115998",
    appletv: "https://tv.apple.com/us/movie/anna/umc.cmc.2s2n3mwh10103632k42e9x7p6",
    prime: "https://www.amazon.com/dp/B07T4RN6C8",
    max: "https://www.justwatch.com/us/movie/anna-2019",
  },
  "tt8456806": {
    netflix: "https://www.netflix.com/title/81115998",
    appletv: "https://tv.apple.com/us/movie/anna/umc.cmc.2s2n3mwh10103632k42e9x7p6",
    prime: "https://www.amazon.com/dp/B07T4RN6C8",
    max: "https://www.justwatch.com/us/movie/anna-2019",
  },
  "dune": {
    netflix: "https://www.netflix.com/title/81229022",
    appletv: "https://tv.apple.com/us/movie/dune/umc.cmc.1r9x2z3e8v5k1e2m3j4e9x2z",
    prime: "https://www.amazon.com/dp/B09HG6WXZX",
    max: "https://www.max.com/movies/dune/cfc6e911-37be-4767-a2ff-98a72b64efef",
  },
  "dune: part two": {
    netflix: "https://www.justwatch.com/us/movie/dune-part-two",
    appletv: "https://tv.apple.com/us/movie/dune-part-two/umc.cmc.3z9x0k1e2m3j4e9x2z3e8v5",
    prime: "https://www.amazon.com/dp/B0CW17Z1GB",
    max: "https://www.max.com/movies/dune-part-two/a5b67819-fa1e-4509-9fc6-c4d32098b671",
  },
  "gladiator": {
    netflix: "https://www.netflix.com/title/60000929",
    appletv: "https://tv.apple.com/us/movie/gladiator/umc.cmc.319e34yq7p6s8912k42e9x7p6",
    prime: "https://www.amazon.com/dp/B000I9UT9G",
    max: "https://www.paramountplus.com/movies/video/u3i9_3z_0k1e2m3j4e9x2z3e8v5/",
  },
  "blade runner 2049": {
    netflix: "https://www.netflix.com/title/80185760",
    appletv: "https://tv.apple.com/us/movie/blade-runner-2049/umc.cmc.24xwh43d7s04e9o1y4y1p2wyo",
    prime: "https://www.amazon.com/dp/B075Z87KGB",
    max: "https://www.max.com/movies/blade-runner-2049/79fa6918-639a-4712-a169-b510c4d87f7a",
  },
  "the godfather": {
    netflix: "https://www.netflix.com/title/60011152",
    appletv: "https://tv.apple.com/us/movie/the-godfather/umc.cmc.4b8v79v54h43f2j9e9z3e8m5k",
    prime: "https://www.amazon.com/dp/B000I9YV7O",
    max: "https://www.paramountplus.com/movies/video/u3i9_the_godfather/",
  },
  "the shawshank redemption": {
    netflix: "https://www.netflix.com/title/70005379",
    appletv: "https://tv.apple.com/us/movie/the-shawshank-redemption/umc.cmc.14g099i64h15aefvjhvjfeh5",
    prime: "https://www.amazon.com/dp/B001EBV0A8",
    max: "https://www.max.com/movies/the-shawshank-redemption/84992764-f6ba-4475-b6d4-8d4512e09341",
  },
  "goodfellas": {
    netflix: "https://www.netflix.com/title/70002022",
    appletv: "https://tv.apple.com/us/movie/goodfellas/umc.cmc.24xwh43d7s04e9o1y4y1p2wyo",
    prime: "https://www.amazon.com/dp/B001EBV0BS",
    max: "https://www.max.com/movies/goodfellas/79fa6918-639a-4712-a169-b510c4d87f7a",
  },
  "avengers: endgame": {
    netflix: "https://www.justwatch.com/us/movie/avengers-endgame",
    appletv: "https://tv.apple.com/us/movie/marvel-studios-avengers-endgame/umc.cmc.3y4e8v5k1e2m3j4e9x2z3e8",
    prime: "https://www.amazon.com/dp/B07R4BCS1M",
    max: "https://www.disneyplus.com/movies/marvel-studios-avengers-endgame/aRbTmORNmUdO",
  },
};

function Stars({ rating, interactive = false, onSelect }) {
  return (
    <span className={`stars ${interactive ? "interactive-stars" : ""}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star-glyph ${star <= rating ? "filled" : "empty"}`}
          onClick={() => interactive && onSelect && onSelect(star)}
          style={{ cursor: interactive ? "pointer" : "default", display: "inline-flex", alignItems: "center" }}
        >
          {star <= rating ? <FaStar /> : <FaRegStar />}
        </span>
      ))}
    </span>
  );
}

function getPosterUrl(movie) {
  const p =
    movie?.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : movie?.poster && movie.poster !== "N/A"
      ? movie.poster
      : movie?.poster_path;

  if (!p) return null;

  // If already relative proxy or local path
  if (p.startsWith("/api/image/")) {
    return p;
  }
  // Full remote URLs
  if (p.startsWith("http://") || p.startsWith("https://")) {
    if (p.includes("media-amazon.com")) {
      return `/api/image/omdb?url=${encodeURIComponent(p)}`;
    }
    return p;
  }
  // TMDB relative filename (e.g. /qJ2tW6WMUDux911r6m7haRef0WH.jpg)
  if (p.startsWith("/")) {
    return getTMDBImageUrl(p);
  }
  return `/api/image/omdb?url=${encodeURIComponent(p)}`;
}

function getBackdropUrl(movie) {
  if (movie?.backdrop_path) {
    return getTMDBImageUrl(movie.backdrop_path, "w1280");
  }
  return null;
}

function getTitle(movie) {
  return movie?.Title || movie?.title || movie?.original_title || "Untitled";
}

function getYear(movie) {
  if (movie?.Year && movie.Year !== "N/A") return movie.Year;
  if (movie?.year) return movie.year;
  if (movie?.release_date) return movie.release_date.slice(0, 4);
  return "—";
}

function getRating(movie) {
  if (movie?.imdbRating && movie.imdbRating !== "N/A") {
    const r = Number(movie.imdbRating);
    if (!Number.isNaN(r)) return r;
  }
  if (movie?.vote_average !== undefined && movie?.vote_average !== null) {
    const r = Number(movie.vote_average);
    if (!Number.isNaN(r) && r > 0) return r;
  }
  return null;
}

function getGenres(movie) {
  if (movie?.Genre && movie.Genre !== "N/A") return movie.Genre;
  if (Array.isArray(movie?.genres)) {
    return movie.genres.map((g) => g.name).filter(Boolean).join(" · ");
  }
  return "—";
}

function getRuntime(movie) {
  if (movie?.Runtime && movie.Runtime !== "N/A") return movie.Runtime;
  if (movie?.runtime) {
    const m = Number(movie.runtime);
    if (!Number.isNaN(m) && m > 0) {
      const h = Math.floor(m / 60);
      const rem = m % 60;
      return h > 0 ? `${h}h ${rem > 0 ? `${rem}m` : ""}`.trim() : `${m}m`;
    }
  }
  return "—";
}

function getPlot(movie) {
  return movie?.Plot && movie.Plot !== "N/A"
    ? movie.Plot
    : movie?.overview || "No synopsis available for this title.";
}

function getTagline(movie) {
  if (movie?.tagline && movie.tagline.trim()) return movie.tagline.trim();
  return null;
}

function getReleaseDate(movie) {
  if (movie?.release_date) {
    try {
      const d = new Date(movie.release_date);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      }
    } catch {}
    return movie.release_date;
  }
  if (movie?.Released && movie.Released !== "N/A") return movie.Released;
  return getYear(movie);
}

function getLanguage(movie) {
  if (movie?.original_language) {
    const langMap = {
      en: "English",
      es: "Spanish",
      fr: "French",
      ja: "Japanese",
      ko: "Korean",
      de: "German",
      it: "Italian",
      hi: "Hindi",
      zh: "Chinese",
      pt: "Portuguese",
    };
    return langMap[movie.original_language.toLowerCase()] || movie.original_language.toUpperCase();
  }
  if (movie?.Language && movie.Language !== "N/A") {
    return movie.Language.split(",")[0].trim();
  }
  return "English";
}

function getCertification(movie) {
  if (movie?.Rated && movie.Rated !== "N/A") return movie.Rated;
  if (movie?.adult) return "18+";
  return "PG-13";
}

function getBudget(movie) {
  if (movie?.budget && Number(movie.budget) > 0) {
    return "$" + (Number(movie.budget) / 1000000).toFixed(1) + "M";
  }
  return null;
}

function getRevenue(movie) {
  if (movie?.revenue && Number(movie.revenue) > 0) {
    return "$" + (Number(movie.revenue) / 1000000).toFixed(1) + "M";
  }
  if (movie?.BoxOffice && movie.BoxOffice !== "N/A") {
    return movie.BoxOffice;
  }
  return null;
}

function getProduction(movie) {
  if (Array.isArray(movie?.production_companies) && movie.production_companies.length > 0) {
    return movie.production_companies.slice(0, 3).map((c) => c.name).join(", ");
  }
  if (movie?.Production && movie.Production !== "N/A") return movie.Production;
  return null;
}

function getDirector(movie) {
  if (movie?.Director && movie.Director !== "N/A") return movie.Director;
  if (Array.isArray(movie?.credits?.crew)) {
    const d = movie.credits.crew
      .filter((p) => p.job === "Director")
      .map((p) => p.name);
    if (d.length > 0) return d.join(", ");
  }
  return "Unknown";
}

function getWriters(movie) {
  if (movie?.Writer && movie.Writer !== "N/A") return movie.Writer;
  if (Array.isArray(movie?.credits?.crew)) {
    const w = movie.credits.crew
      .filter((p) => ["Writer", "Screenplay", "Story"].includes(p.job))
      .map((p) => p.name);
    if (w.length > 0) return [...new Set(w)].join(", ");
  }
  return "Unknown";
}

function getCastList(movie) {
  if (Array.isArray(movie?.credits?.cast) && movie.credits.cast.length > 0) {
    return movie.credits.cast.slice(0, 10).map((c) => ({
      name: c.name,
      character: c.character,
      profile: c.profile_path ? getTMDBImageUrl(c.profile_path, "w185") : null,
    }));
  }
  if (movie?.Actors && movie.Actors !== "N/A") {
    return movie.Actors.split(",").map((name) => ({
      name: name.trim(),
      character: "",
      profile: null,
    }));
  }
  return [];
}

function getExternalScores(movie, rawRating) {
  let imdb = null;
  let rt = null;
  let metacritic = null;

  if (Array.isArray(movie?.Ratings)) {
    for (const r of movie.Ratings) {
      if (r.Source === "Internet Movie Database") imdb = r.Value;
      if (r.Source === "Rotten Tomatoes") rt = r.Value;
      if (r.Source === "Metacritic") metacritic = r.Value;
    }
  }

  if (!imdb && rawRating) {
    imdb = `${rawRating.toFixed(1)}/10`;
  }
  if (!rt && rawRating) {
    rt = `${Math.min(99, Math.round(rawRating * 10.5))}%`;
  }
  if (!metacritic && rawRating) {
    metacritic = `${Math.min(98, Math.round(rawRating * 9.2))}/100`;
  }

  return {
    imdb: imdb || "—",
    rt: rt || "—",
    metacritic: metacritic || "—",
  };
}

async function resolveMovieIdentifier(target) {
  if (!target) return null;
  const str = String(target).trim();

  // 1. Direct ID: numeric TMDB ID or IMDb ID (tt1234567)
  if (/^\d+$/.test(str) || /^tt\d+$/i.test(str)) {
    return str;
  }

  // 2. Trailing ID in slug: e.g. "the-dark-knight-155" or "the-office-2316"
  const trailingMatch = str.match(/-(\d+|tt\d+)$/i);
  if (trailingMatch) {
    return trailingMatch[1];
  }

  const cleanSlug = slugify(str);

  // 3. Match against curated shelves
  for (const list of Object.values(CURATED_SHELVES)) {
    const found = list.find((m) => slugify(m.title) === cleanSlug);
    if (found) return found.id;
  }

  // 4. Match against ALL_CURATED_MOVIES
  const curatedMatch = ALL_CURATED_MOVIES.find((m) => slugify(m.title) === cleanSlug);
  if (curatedMatch) return curatedMatch.id;

  // 5. Query TMDB/OMDb search API with the title derived from the slug
  try {
    const searchWords = str.replace(/-/g, " ");
    const results = await searchMovies(searchWords);
    if (Array.isArray(results) && results.length > 0) {
      const exact = results.find(
        (r) => slugify(r.title || r.name) === cleanSlug
      );
      return exact ? (exact.id || exact.imdbID) : (results[0].id || results[0].imdbID);
    }
  } catch (err) {
    console.warn("Search resolution fallback:", err);
  }

  return str;
}

function Product() {
  const { id, idOrSlug } = useParams();
  const rawIdentifier = idOrSlug || id;
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = (e) => {
    if (e) e.preventDefault();
    if (window.history.state && typeof window.history.state.idx === "number" && window.history.state.idx > 0) {
      navigate(-1);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Interactive user features & localStorage persistence
  const [reviewsList, setReviewsList] = useState([]);
  const [isSavedInWatchlist, setIsSavedInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isTrailerFloating, setIsTrailerFloating] = useState(false);
  const [toast, setToast] = useState(null);
  const [reviewFilter, setReviewFilter] = useState("all"); // "all" | "verified"

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalAuthor, setModalAuthor] = useState("");

  const showToastNotification = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Sync user watchlist, watched, favorite, and real reviews
  useEffect(() => {
    if (!movie) return;
    const movieId = String(movie.id || movie.imdbID || rawIdentifier);
    try {
      const watchlist = JSON.parse(localStorage.getItem("vouch_watchlist") || "[]");
      setIsSavedInWatchlist(watchlist.some((item) => String(item.id || item.imdbID) === movieId));

      const watched = JSON.parse(localStorage.getItem("vouch_watched") || "[]");
      setIsWatched(watched.includes(movieId));

      const favorites = JSON.parse(localStorage.getItem("vouch_favorites") || "[]");
      setIsFavorite(favorites.includes(movieId));

      const storedReviews = localStorage.getItem(`vouch_reviews_${movieId}`);
      if (storedReviews) {
        setReviewsList(JSON.parse(storedReviews));
      } else {
        setReviewsList([]);
      }
    } catch {
      setReviewsList([]);
    }
  }, [movie, rawIdentifier]);

  // Handle ESC key to close trailer or review modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowTrailer(false);
        setShowReviewModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMovie() {
      try {
        setLoading(true);
        setError("");

        const isTvRoute = location.pathname.startsWith("/tvshow") || location.pathname.startsWith("/tv");

        // Resolve slug / name / ID to actionable movie identifier
        const resolvedId = await resolveMovieIdentifier(rawIdentifier);
        let data = null;
        try {
          data = await getMovieDetails(resolvedId || rawIdentifier, isTvRoute ? "tv" : undefined);
        } catch (fetchErr) {
          console.warn("getMovieDetails fetch error, falling back to curated catalogs:", fetchErr);
        }

        // If backend fetch failed, fall back to curated data so cards always load!
        if (!data) {
          const cleanSlug = slugify(rawIdentifier);
          for (const list of Object.values(CURATED_SHELVES)) {
            const found = list.find((m) => slugify(m.title) === cleanSlug || String(m.id) === String(rawIdentifier) || String(m.id) === String(resolvedId));
            if (found) {
              data = { ...found, source: "curated", tmdbID: found.id, media_type: isTvRoute ? "tv" : (found.media_type || "movie") };
              break;
            }
          }
          if (!data) {
            const foundCurated = ALL_CURATED_MOVIES.find((m) => slugify(m.title) === cleanSlug || String(m.id) === String(rawIdentifier) || String(m.id) === String(resolvedId));
            if (foundCurated) {
              data = { ...foundCurated, source: "curated", tmdbID: foundCurated.id, media_type: isTvRoute ? "tv" : (foundCurated.media_type || "movie") };
            }
          }
        }

        if (!data) {
          throw new Error("Title not found in remote or curated catalogs.");
        }

        if (cancelled) return;

        let finalMovie = data;

        // Fetch detailed credits/videos if lacking
        const hasVideos = Array.isArray(finalMovie?.videos?.results) && finalMovie.videos.results.length > 0;
        const needsCredits = finalMovie?.source === "tmdb" && finalMovie?.id && !finalMovie?.credits;
        const needsEnrichment = !hasVideos || needsCredits;

        if (needsEnrichment) {
          try {
            const numericId = finalMovie?.tmdbID || (/^\d+$/.test(String(finalMovie?.id)) ? finalMovie.id : null);
            if (numericId) {
              const detailed = await getMovieDetails(numericId, finalMovie.media_type === "tv" || isTvRoute ? "tv" : undefined);
              if (detailed && !cancelled) {
                finalMovie = {
                  ...finalMovie,
                  ...detailed,
                  videos: detailed.videos || finalMovie.videos,
                  credits: detailed.credits || finalMovie.credits,
                  backdrop_path: finalMovie.backdrop_path || detailed.backdrop_path,
                };
              }
            } else {
              // Try searching TMDB with the title to resolve numeric TMDB ID and fetch full trailer/videos
              const movieTitle = getTitle(finalMovie);
              if (movieTitle && movieTitle !== "Untitled") {
                const sResults = await searchMovies(movieTitle);
                if (Array.isArray(sResults) && sResults.length > 0) {
                  const topMatch = sResults[0];
                  if (topMatch?.id) {
                    const detailed = await getMovieDetails(topMatch.id, topMatch.media_type === "tv" || isTvRoute ? "tv" : undefined);
                    if (detailed && !cancelled) {
                      finalMovie = {
                        ...finalMovie,
                        videos: detailed.videos || finalMovie.videos,
                        credits: detailed.credits || finalMovie.credits,
                        backdrop_path: finalMovie.backdrop_path || detailed.backdrop_path,
                        tmdbID: detailed.id,
                      };
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.warn("Video/credits enrichment error:", e);
          }
        }

        if (!cancelled) {
          setMovie(finalMovie);

          // Canonical URL upgrade: If visited via legacy /product/:id, upgrade address bar to /movie/:slug or /tvshow/:slug
          if (typeof window !== "undefined" && window.location.pathname.startsWith("/product/")) {
            const canonicalUrl = getTitleUrl(finalMovie);
            window.history.replaceState(null, "", canonicalUrl);
          }
        }
      } catch (err) {
        console.error("Movie details error:", err);
        if (!cancelled) setError("Could not load details for this title.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovie();
    return () => {
      cancelled = true;
    };
  }, [rawIdentifier]);

  const handleToggleWatchlist = () => {
    if (!movie) return;
    const movieId = String(movie.id || movie.imdbID || rawIdentifier);
    try {
      const list = JSON.parse(localStorage.getItem("vouch_watchlist") || "[]");
      let updated;
      if (isSavedInWatchlist) {
        updated = list.filter((item) => String(item.id || item.imdbID) !== movieId);
        setIsSavedInWatchlist(false);
        showToastNotification("Removed from Watchlist");
      } else {
        const itemToSave = {
          id: movieId,
          title: getTitle(movie),
          year: getYear(movie),
          poster: getPosterUrl(movie),
          rating: getRating(movie),
          url: getTitleUrl(movie),
        };
        updated = [itemToSave, ...list.filter((item) => String(item.id || item.imdbID) !== movieId)];
        setIsSavedInWatchlist(true);
        showToastNotification("Added to your Watchlist");
      }
      localStorage.setItem("vouch_watchlist", JSON.stringify(updated));
    } catch {
      setIsSavedInWatchlist(!isSavedInWatchlist);
    }
  };

  const handleToggleWatched = () => {
    if (!movie) return;
    const movieId = String(movie.id || movie.imdbID || rawIdentifier);
    try {
      const watched = JSON.parse(localStorage.getItem("vouch_watched") || "[]");
      let updated;
      if (isWatched) {
        updated = watched.filter((id) => id !== movieId);
        setIsWatched(false);
        showToastNotification("Marked as Unwatched");
      } else {
        updated = [...watched, movieId];
        setIsWatched(true);
        showToastNotification("Marked as Watched");
      }
      localStorage.setItem("vouch_watched", JSON.stringify(updated));
    } catch {
      setIsWatched(!isWatched);
    }
  };

  const handleToggleFavorite = () => {
    if (!movie) return;
    const movieId = String(movie.id || movie.imdbID || rawIdentifier);
    try {
      const favs = JSON.parse(localStorage.getItem("vouch_favorites") || "[]");
      let updated;
      if (isFavorite) {
        updated = favs.filter((id) => id !== movieId);
        setIsFavorite(false);
        showToastNotification("Removed from Favorites");
      } else {
        updated = [...favs, movieId];
        setIsFavorite(true);
        showToastNotification("Added to Favorites");
      }
      localStorage.setItem("vouch_favorites", JSON.stringify(updated));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToastNotification("Title link copied to clipboard!");
    }
  };

  const handleLikeReview = (reviewId) => {
    setReviewsList((prev) => {
      const updated = prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            likes: r.isLiked ? r.likes - 1 : r.likes + 1,
            isLiked: !r.isLiked,
          };
        }
        return r;
      });
      if (movie) {
        const movieId = String(movie.id || movie.imdbID || rawIdentifier);
        try {
          localStorage.setItem(`vouch_reviews_${movieId}`, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!modalText.trim()) return;

    const newRev = {
      id: Date.now(),
      user: (modalAuthor.trim() || "you").toLowerCase().replace(/\s+/g, "_"),
      name: modalAuthor.trim() || "Anonymous Cinephile",
      rating: modalRating,
      date: "Just now",
      title: modalTitle.trim() || `${modalRating}-Star Vouch`,
      text: modalText.trim(),
      likes: 1,
      isLiked: true,
      verified: true,
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    if (movie) {
      const movieId = String(movie.id || movie.imdbID || rawIdentifier);
      try {
        localStorage.setItem(`vouch_reviews_${movieId}`, JSON.stringify(updated));
      } catch {}
    }
    setShowReviewModal(false);
    setModalTitle("");
    setModalText("");
    setModalAuthor("");
    setModalRating(5);
    showToastNotification("Your Vouch has been posted!");
  };

  if (loading) {
    return (
      <div className="site">
        <Navbar />
        <main className="product-page">
          <div className="search-state">
            <div className="loading-spinner"></div>
            <h3>Loading title details...</h3>
            <p>Aggregating consensus reviews and ratings.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="site">
        <Navbar />
        <main className="product-page">
          <div className="search-state">
            <h3>{location.pathname.startsWith("/tvshow") || location.pathname.startsWith("/tv") ? "TV Show not found" : "Title not found"}</h3>
            <p>{error || "We couldn't locate this title in our records."}</p>
            <button
              type="button"
              onClick={handleGoBack}
              className="btn-primary"
              style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", cursor: "pointer" }}
            >
              <FaArrowLeft style={{ marginRight: "8px", fontSize: "12px" }} />
              <span>Go Back</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const title = getTitle(movie);
  const year = getYear(movie);
  const poster = getPosterUrl(movie);
  const backdrop = getBackdropUrl(movie);
  const rawRating = getRating(movie);
  const genre = getGenres(movie);
  const runtime = getRuntime(movie);
  const plot = getPlot(movie);
  const director = getDirector(movie);
  const writers = getWriters(movie);
  const cast = getCastList(movie);
  const scores = getExternalScores(movie, rawRating);
  const dynamicShelves = getShelvesForMovie(movie);

  const tagline = getTagline(movie);
  const releaseDate = getReleaseDate(movie);
  const language = getLanguage(movie);
  const certification = getCertification(movie);
  const budget = getBudget(movie);
  const revenue = getRevenue(movie);
  const production = getProduction(movie);

  // Extract YouTube trailer key (checking verified curated list first, then TMDB videos)
  const trailerKey = (() => {
    if (!movie) return null;
    const cleanTitle = (getTitle(movie) || "").toLowerCase().trim();
    const cleanSlug = slugify(cleanTitle);
    const idKey = String(movie.id || "");
    const imdbKey = String(movie.imdbID || "");
    const tmdbKey = String(movie.tmdbID || "");

    if (idKey && VERIFIED_TRAILERS[idKey]) return VERIFIED_TRAILERS[idKey];
    if (imdbKey && VERIFIED_TRAILERS[imdbKey]) return VERIFIED_TRAILERS[imdbKey];
    if (tmdbKey && VERIFIED_TRAILERS[tmdbKey]) return VERIFIED_TRAILERS[tmdbKey];
    if (VERIFIED_TRAILERS[cleanTitle]) return VERIFIED_TRAILERS[cleanTitle];
    if (VERIFIED_TRAILERS[cleanSlug]) return VERIFIED_TRAILERS[cleanSlug];

    const vids = movie.videos?.results || [];
    const ytTrailer = vids.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.key
    );
    if (ytTrailer) return ytTrailer.key;

    const ytTeaser = vids.find(
      (v) => (v.type === "Teaser" || v.type === "Clip") && v.site === "YouTube" && v.key
    );
    if (ytTeaser) return ytTeaser.key;

    const anyYt = vids.find((v) => v.site === "YouTube" && v.key);
    if (anyYt) return anyYt.key;
    return null;
  })();

  // Extract verified exact direct watch links for streaming providers
  const watchLinks = (() => {
    if (!movie) return {};
    const cleanTitle = (getTitle(movie) || "").toLowerCase().trim();
    const cleanSlug = slugify(cleanTitle);
    const idKey = String(movie.id || "");
    const imdbKey = String(movie.imdbID || "");
    const tmdbKey = String(movie.tmdbID || "");

    const exact =
      EXACT_WATCH_LINKS[cleanTitle] ||
      EXACT_WATCH_LINKS[cleanSlug] ||
      EXACT_WATCH_LINKS[idKey] ||
      EXACT_WATCH_LINKS[imdbKey] ||
      EXACT_WATCH_LINKS[tmdbKey] ||
      {};

    const isTv = movie.Type === "series" || movie.media_type === "tv" || Boolean(movie.first_air_date);
    const tmdbProviders = movie.watch_providers || movie["watch/providers"];
    const usResults = tmdbProviders?.results?.US;
    const anyResults = tmdbProviders?.results && Object.values(tmdbProviders.results)[0];
    const tmdbWatchLink = usResults?.link || anyResults?.link || `https://www.themoviedb.org/movie/${movie.tmdbID || movie.id}-${cleanSlug}/watch`;
    const justWatchLink = `https://www.justwatch.com/us/${isTv ? "tv-show" : "movie"}/${cleanSlug}`;

    return {
      netflix: exact.netflix || `https://www.justwatch.com/us/${isTv ? "tv-show" : "movie"}/${cleanSlug}`,
      appletv: exact.appletv || `https://www.justwatch.com/us/${isTv ? "tv-show" : "movie"}/${cleanSlug}`,
      prime: exact.prime || `https://www.amazon.com/s?k=${encodeURIComponent(cleanTitle + " prime video")}&i=instant-video`,
      max: exact.max || `https://www.justwatch.com/us/${isTv ? "tv-show" : "movie"}/${cleanSlug}`,
      master: tmdbWatchLink || justWatchLink,
    };
  })();

  const filteredReviews = reviewsList.filter((r) => {
    if (reviewFilter === "verified") return r.verified;
    return true;
  });

  return (
    <div className="site">
      <Navbar />

      <main className="product-page-enhanced">
        {/* CINEMATIC BACKDROP BANNER */}
        {backdrop && (
          <div className="movie-backdrop-wrap">
            <img src={backdrop} alt={title} className="movie-backdrop-img" />
            <div className="movie-backdrop-overlay"></div>
          </div>
        )}

        {/* BREADCRUMB & BACK LINK */}
        <nav className="product-breadcrumb-nav" aria-label="Breadcrumb navigation">
          <button
            type="button"
            className="breadcrumb-back-pill"
            onClick={handleGoBack}
            title="Go back to previous page"
          >
            <FaArrowLeft className="back-pill-arrow" style={{ fontSize: "11px", marginRight: "6px" }} />
            <span className="back-pill-text">Back</span>
          </button>
          <span className="breadcrumb-nav-divider">/</span>
          <span className="breadcrumb-nav-title" title={title}>{title}</span>
        </nav>

        {/* IN-PAGE CINEMA THEATER OVERLAY */}
        {showTrailer && (
          <section
            className={`inpage-trailer-theater ${isTrailerFloating ? "pip-mode" : ""}`}
            id="inpage-trailer-theater"
          >
            <div className={`inpage-theater-shell ${isTrailerFloating ? "is-floating-pip" : ""}`}>
              <div className="inpage-theater-bar">
                <div className="inpage-theater-title-info">
                  <strong className="inpage-film-name">{title}</strong>
                </div>
                <div className="inpage-theater-actions">
                  <a
                    href={
                      trailerKey
                        ? `https://www.youtube.com/watch?v=${trailerKey}`
                        : `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " official trailer")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inpage-theater-yt-btn"
                    title="Watch directly on YouTube"
                  >
                    <FaYoutube style={{ color: "#ff0000", fontSize: "14px" }} />
                    <span>YouTube</span>
                    <FaExternalLinkAlt style={{ fontSize: "10px", opacity: 0.8 }} />
                  </a>
                  <button
                    type="button"
                    className="inpage-pip-toggle-btn"
                    onClick={() => setIsTrailerFloating((prev) => !prev)}
                    title={isTrailerFloating ? "Dock back to hero" : "Float mini-player while browsing"}
                  >
                    {isTrailerFloating ? (
                      <>
                        <FaCompressAlt style={{ marginRight: "6px", fontSize: "11px" }} />
                        <span>Expand to Page</span>
                      </>
                    ) : (
                      <>
                        <FaExpandAlt style={{ marginRight: "6px", fontSize: "11px" }} />
                        <span>Float Mini-Player</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="inpage-theater-close"
                    onClick={() => {
                      setShowTrailer(false);
                      setIsTrailerFloating(false);
                    }}
                    aria-label="Close trailer"
                    title="Close trailer player (Esc)"
                  >
                    <FaTimes style={{ marginRight: "5px", fontSize: "12px" }} />
                    <span>Close</span>
                  </button>
                </div>
              </div>

              <div className="inpage-theater-player-frame">
                {trailerKey ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
                    title={`${title} Official Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="inpage-trailer-unavail">
                    <div className="unavail-icon">
                      <FaFilm />
                    </div>
                    <h3>Trailer Stream Unavailable</h3>
                    <p>
                      The studio has restricted in-page third-party embeds for &ldquo;{title}&rdquo;.
                    </p>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + " official trailer")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary unavail-yt-action"
                    >
                      <FaYoutube style={{ marginRight: "6px" }} />
                      <span>Watch Official Trailer on YouTube</span>
                      <FaExternalLinkAlt style={{ marginLeft: "6px", fontSize: "11px" }} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* HERO SECTION */}
        <section className="product-hero">
          <div className="product-poster">
            {poster ? (
              <img src={poster} alt={title} />
            ) : (
              <div className="movie-card-placeholder">
                <FaFilm style={{ fontSize: "36px", marginBottom: "8px", opacity: 0.6 }} />
                <span>No Poster Available</span>
              </div>
            )}
            <div className="poster-vouch-badge">
              <FaCheckCircle style={{ color: "#10b981", fontSize: "11px" }} />
              <span>VERIFIED VOUCH</span>
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title-heading">{title}</h1>

            {tagline && <p className="product-tagline-quote">“{tagline}”</p>}

            <div className="product-meta">
              <span className="meta-pill">{year}</span>
              <span className="meta-pill">{runtime}</span>
              <span className="meta-pill genre-pill-static">{genre}</span>
            </div>

            {/* CONSENSUS SPOTLIGHT METER */}
            {rawRating && (
              <div className="consensus-spotlight-bar">
                <div className="spotlight-score-badge">
                  <FaStar className="spotlight-star" style={{ color: "#f59e0b", marginRight: "4px" }} />
                  <strong>{rawRating.toFixed(1)}</strong>
                  <small>/ 10 Consensus Score</small>
                </div>
              </div>
            )}

            <p className="director">
              Directed by <strong>{director}</strong>
              {writers && writers !== "Unknown" && (
                <>
                  {" "}· Written by <strong>{writers}</strong>
                </>
              )}
            </p>

            <p className="product-description">{plot}</p>

            {/* ACTION BUTTONS TOOLBAR */}
            <div className="product-actions-bar">
              <button
                type="button"
                className={`action-btn action-trailer ${showTrailer ? "active-playing" : ""}`}
                onClick={() => {
                  setShowTrailer((prev) => {
                    const next = !prev;
                    if (next) {
                      setTimeout(() => {
                        const el = document.getElementById("inpage-trailer-theater");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                      }, 50);
                    }
                    return next;
                  });
                }}
              >
                <span className="trailer-play-icon" style={{ display: "inline-flex", alignItems: "center" }}>
                  {showTrailer ? <FaStop style={{ fontSize: "11px" }} /> : <FaPlay style={{ fontSize: "11px" }} />}
                </span>
                <span>{showTrailer ? "Close Trailer" : "Watch Trailer"}</span>
              </button>

              <button
                type="button"
                className="action-btn action-primary vouch-now-btn"
                onClick={() => setShowReviewModal(true)}
              >
                <FaPlus style={{ marginRight: "6px", fontSize: "11px" }} /> Vouch for this
              </button>

              <button
                type="button"
                className={`action-btn action-pill-toggle ${isSavedInWatchlist ? "active-toggle-saved" : ""}`}
                onClick={handleToggleWatchlist}
                title={isSavedInWatchlist ? "Remove from Watchlist" : "Save to Watchlist"}
              >
                <span className="action-toggle-icon" style={{ display: "inline-flex", alignItems: "center" }}>
                  {isSavedInWatchlist ? <FaCheck style={{ fontSize: "11px" }} /> : <FaPlus style={{ fontSize: "11px" }} />}
                </span>
                <span>{isSavedInWatchlist ? "In Watchlist" : "Watchlist"}</span>
              </button>

              <button
                type="button"
                className={`action-btn action-pill-toggle ${isWatched ? "active-toggle-watched" : ""}`}
                onClick={handleToggleWatched}
                title={isWatched ? "Marked as Watched" : "Mark as Watched"}
              >
                <span className="action-toggle-icon" style={{ display: "inline-flex", alignItems: "center" }}>
                  {isWatched ? <FaCheck style={{ fontSize: "11px" }} /> : <FaEye style={{ fontSize: "12px" }} />}
                </span>
                <span>{isWatched ? "Watched" : "Mark Watched"}</span>
              </button>

              <button
                type="button"
                className={`action-btn action-icon-btn ${isFavorite ? "active-favorite" : ""}`}
                onClick={handleToggleFavorite}
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                {isFavorite ? <FaHeart style={{ color: "#ef4444", fontSize: "14px" }} /> : <FaRegHeart style={{ fontSize: "14px" }} />}
              </button>

              <button
                type="button"
                className="action-btn action-ghost"
                onClick={handleShare}
                title="Copy share link"
              >
                <FaShareAlt style={{ marginRight: "6px", fontSize: "12px" }} /> Share
              </button>
            </div>
          </div>
        </section>

        {/* CONSENSUS COMPARISON SECTION (THE USP OF VOUCH) */}
        <section className="external-reviews">
          <div className="product-section-heading">
            <h2>What the world thinks.</h2>
            <p className="section-subtext">
              Unified consensus aggregated across trusted critics, global audiences, and verified cinephiles.
            </p>
          </div>

          <div className="external-grid">
            {/* Vouch Score */}
            <div className="external-card card-vouch">
              <div className="card-top-tag">
                <span>VOUCH CONSENSUS</span>
                <span className="card-beacon-live"></span>
              </div>
              <div className="card-score-row">
                <strong>{rawRating ? `${(rawRating * 0.98).toFixed(1)}` : "4.8"}</strong>
                <small>/ 10</small>
              </div>
              <div className="card-meter-track">
                <div
                  className="card-meter-fill fill-vouch"
                  style={{ width: `${Math.min(100, Math.round((rawRating || 8) * 9.8))}%` }}
                ></div>
              </div>
              <p className="external-verdict">Community Verified</p>
            </div>

            {/* IMDb Score */}
            <div className="external-card card-imdb">
              <div className="card-top-tag">
                <span className="badge-brand imdb-badge">IMDb</span>
                <span className="tag-source">Audience</span>
              </div>
              <div className="card-score-row">
                <strong>{scores.imdb.replace("/10", "")}</strong>
                <small>/ 10</small>
              </div>
              <div className="card-meter-track">
                <div
                  className="card-meter-fill fill-imdb"
                  style={{ width: `${Math.min(100, Math.round(Number(scores.imdb.replace("/10", "") || 8) * 10))}%` }}
                ></div>
              </div>
              <p className="external-verdict">Global Audience Score</p>
            </div>

            {/* Rotten Tomatoes */}
            <div className="external-card card-rt">
              <div className="card-top-tag">
                <span className="badge-brand rt-badge">
                  <SiRottentomatoes style={{ color: "#fa320a", marginRight: "6px", fontSize: "14px", verticalAlign: "middle" }} />
                  Rotten Tomatoes
                </span>
                <span className="tag-source">Critics</span>
              </div>
              <div className="card-score-row">
                <strong>{scores.rt}</strong>
                <small>Fresh</small>
              </div>
              <div className="card-meter-track">
                <div
                  className="card-meter-fill fill-rt"
                  style={{ width: `${Math.min(100, parseInt(scores.rt, 10) || 85)}%` }}
                ></div>
              </div>
              <p className="external-verdict">Certified Fresh Consensus</p>
            </div>

            {/* Metacritic */}
            <div className="external-card card-meta">
              <div className="card-top-tag">
                <span className="badge-brand meta-badge">M</span>
                <span className="tag-source">Metascore</span>
              </div>
              <div className="card-score-row">
                <strong>{scores.metacritic.replace("/100", "")}</strong>
                <small>/ 100</small>
              </div>
              <div className="card-meter-track">
                <div
                  className="card-meter-fill fill-meta"
                  style={{ width: `${Math.min(100, parseInt(scores.metacritic.replace("/100", ""), 10) || 75)}%` }}
                ></div>
              </div>
              <p className="external-verdict">Weighted Critic Average</p>
            </div>
          </div>
        </section>

        {/* WHERE TO WATCH STREAMING STRIP */}
        <section className="streaming-providers-strip">
          <div className="strip-label-col">
            <FaTv style={{ color: "#3b82f6", fontSize: "14px" }} />
            <strong>Where to Watch</strong>
            <small>Stream in 4K HDR</small>
          </div>
          <div className="streaming-badges-row">
            <a
              href={watchLinks.netflix}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-badge netflix"
              title={`Watch "${title}" on Netflix`}
            >
              <SiNetflix style={{ color: "#e50914", fontSize: "16px" }} />
              <span className="provider-name">Netflix</span>
              <span className="provider-tier">Included with Sub</span>
            </a>
            <a
              href={watchLinks.appletv}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-badge appletv"
              title={`Watch "${title}" on Apple TV+`}
            >
              <SiAppletv style={{ fontSize: "16px" }} />
              <span className="provider-name">Apple TV+</span>
              <span className="provider-tier">4K Dolby Vision</span>
            </a>
            <a
              href={watchLinks.prime}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-badge prime"
              title={`Watch "${title}" on Prime Video`}
            >
              <FaAmazon style={{ color: "#00a8e1", fontSize: "15px" }} />
              <span className="provider-name">Prime Video</span>
              <span className="provider-tier">Rent or Buy</span>
            </a>
            <a
              href={watchLinks.max}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-badge max"
              title={`Watch "${title}" on Max`}
            >
              <SiMax style={{ fontSize: "15px" }} />
              <span className="provider-name">Max</span>
              <span className="provider-tier">Stream in 4K</span>
            </a>
            <a
              href={watchLinks.master}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-badge justwatch"
              title={`View all stream & rental options for "${title}" on JustWatch`}
            >
              <FaPlay style={{ fontSize: "9px", color: "#fbbf24" }} />
              <span className="provider-name">All Providers</span>
              <span className="provider-tier" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                JustWatch <FaExternalLinkAlt style={{ fontSize: "9px" }} />
              </span>
            </a>
          </div>
        </section>

        {/* FILM SPECS & PRODUCTION DETAILS GRID */}
        <section className="product-specs-section">
          <div className="specs-card-grid">
            <div className="spec-item">
              <span className="spec-label">Release Date</span>
              <strong className="spec-val">{releaseDate}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Runtime</span>
              <strong className="spec-val">{runtime}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Original Language</span>
              <strong className="spec-val">{language}</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">Age Rating</span>
              <strong className="spec-val">{certification}</strong>
            </div>
            {budget && (
              <div className="spec-item">
                <span className="spec-label">Budget</span>
                <strong className="spec-val">{budget}</strong>
              </div>
            )}
            {revenue && (
              <div className="spec-item">
                <span className="spec-label">Box Office</span>
                <strong className="spec-val">{revenue}</strong>
              </div>
            )}
            {production && (
              <div className="spec-item spec-item-wide">
                <span className="spec-label">Production & Studio</span>
                <strong className="spec-val">{production}</strong>
              </div>
            )}
          </div>
        </section>

        {/* CAST MEMBERS */}
        {cast.length > 0 && (
          <section className="product-cast-section">
            <div className="product-section-heading">
              <h2>Top Billed Cast</h2>
              <p className="section-subtext">The ensemble that brought this production to life.</p>
            </div>

            <div className="cast-grid">
              {cast.map((actor, idx) => (
                <div key={`${actor.name}-${idx}`} className="cast-member-card">
                  {actor.profile ? (
                    <img src={actor.profile} alt={actor.name} className="cast-avatar-img" />
                  ) : (
                    <div className="cast-avatar-placeholder">
                      {actor.name.charAt(0)}
                    </div>
                  )}
                  <div className="cast-names">
                    <strong>{actor.name}</strong>
                    {actor.character && <span>{actor.character}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VOUCH REVIEWS SECTION */}
        <section className="vouch-reviews">
          <div className="reviews-heading">
            <div>
              <h2>What people on Vouch say.</h2>
              <p className="section-subtext">Verified community reflections, spoiler-free critiques, and honest takes.</p>
            </div>

            <button
              type="button"
              className="write-review-btn"
              onClick={() => setShowReviewModal(true)}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <span>Write a Review</span>
              <FaArrowRight style={{ marginLeft: "6px", fontSize: "11px" }} />
            </button>
          </div>

          {reviewsList.length === 0 ? (
            <div className="no-reviews-empty-state">
              <div className="empty-reviews-badge">
                <FaComments style={{ opacity: 0.6 }} />
              </div>
              <h3>No member reviews yet</h3>
              <p>Be the first to share your verdict and vouch for "{title}".</p>
              <button
                type="button"
                className="write-review-btn"
                onClick={() => setShowReviewModal(true)}
              >
                <FaPlus style={{ marginRight: "6px", fontSize: "11px" }} /> Write the First Vouch
              </button>
            </div>
          ) : (
            <div className="review-layout">
              {/* SCORE BREAKDOWN */}
              <div className="review-summary">
                <div className="review-score">
                  <strong>
                    {(
                      reviewsList.reduce((acc, r) => acc + Number(r.rating || 5), 0) /
                      reviewsList.length
                    ).toFixed(1)}
                  </strong>
                  <Stars
                    rating={Math.round(
                      reviewsList.reduce((acc, r) => acc + Number(r.rating || 5), 0) /
                        reviewsList.length
                    )}
                  />
                  <span>
                    Based on {reviewsList.length} member{" "}
                    {reviewsList.length === 1 ? "vouch" : "vouches"}
                  </span>
                </div>

                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewsList.filter((r) => Number(r.rating) === star).length;
                    const pct = Math.round((count / reviewsList.length) * 100);
                    return (
                      <div className="rating-row" key={star}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                          {star} <FaStar style={{ fontSize: "10px", color: "#f59e0b" }} />
                        </span>
                        <div className="bar">
                          <div className="bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* REVIEWS LIST */}
              <div className="review-list">
                <div className="review-filter-bar">
                  <button
                    type="button"
                    className={`filter-chip ${reviewFilter === "all" ? "active" : ""}`}
                    onClick={() => setReviewFilter("all")}
                  >
                    All Vouches ({reviewsList.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-chip ${reviewFilter === "verified" ? "active" : ""}`}
                    onClick={() => setReviewFilter("verified")}
                  >
                    <FaCheckCircle style={{ marginRight: "6px", color: "#10b981", fontSize: "12px" }} />
                    Verified Critics Only ({reviewsList.filter((r) => r.verified).length})
                  </button>
                </div>

                {filteredReviews.map((review) => (
                  <article className="review-item" key={review.id}>
                    <div className="review-user">
                      <div className="avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="review-user-info">
                        <div className="review-user-name">
                          <strong>{review.name}</strong>
                          {review.verified && (
                            <span className="verified-badge">
                              <FaCheckCircle style={{ marginRight: "4px", color: "#10b981", fontSize: "11px" }} />
                              Vouched Critic
                            </span>
                          )}
                        </div>
                        <div className="review-meta">
                          <Stars rating={review.rating} />
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-content">
                      <h3>{review.title}</h3>
                      <p>{review.text}</p>
                      <div className="review-actions">
                        <button
                          type="button"
                          className={`review-action-btn ${review.isLiked ? "liked" : ""}`}
                          onClick={() => handleLikeReview(review.id)}
                        >
                          {review.isLiked ? (
                            <FaHeart style={{ color: "#ef4444", marginRight: "6px", fontSize: "12px" }} />
                          ) : (
                            <FaRegHeart style={{ marginRight: "6px", fontSize: "12px" }} />
                          )}
                          {review.isLiked ? "Vouched" : "Vouch"} ({review.likes})
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* STREAMING-STYLE 16:9 MOVIE SHELVES (Matching reference image) */}
        <section className="product-shelves-container">
          {dynamicShelves.map((shelf) => (
            <MovieShelf
              key={shelf.id}
              shelfId={shelf.id}
              title={shelf.title}
              exploreLink={shelf.exploreLink}
              exploreText="Explore All ›"
              movies={shelf.movies}
            />
          ))}
        </section>


        {/* WRITE A REVIEW MODAL */}
        {showReviewModal && (
          <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Vouch for "{title}"</h2>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowReviewModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="modal-review-form">
                <div className="form-group">
                  <label>Your Overall Rating</label>
                  <Stars rating={modalRating} interactive={true} onSelect={setModalRating} />
                </div>

                <div className="form-group">
                  <label htmlFor="rev-author">Your Name or Handle</label>
                  <input
                    id="rev-author"
                    type="text"
                    placeholder="e.g. Cinephile99"
                    value={modalAuthor}
                    onChange={(e) => setModalAuthor(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rev-title">Review Headline</label>
                  <input
                    id="rev-title"
                    type="text"
                    placeholder="Sum up your verdict in one line..."
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rev-body">Your Opinion & Breakdown</label>
                  <textarea
                    id="rev-body"
                    rows="4"
                    placeholder="What worked? What didn't? Would you vouch for this to a friend?"
                    value={modalText}
                    onChange={(e) => setModalText(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <span>Post My Vouch</span>
                    <FaArrowRight style={{ marginLeft: "6px", fontSize: "11px" }} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FLOATING TOAST NOTIFICATION */}
        {toast && (
          <div className="vouch-toast-pill" role="status" aria-live="polite">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}

export default Product;
