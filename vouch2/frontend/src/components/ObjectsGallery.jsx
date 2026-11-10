import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getTitleUrl } from "../utils/slug";
import { getTMDBImageUrl } from "../api/tmdb";

const GALLERY_OBJECTS = [
  {
    id: 693134,
    catalogNo: "OBJ-001",
    title: "Dune: Part Two",
    year: "2024",
    director: "Denis Villeneuve",
    runtime: "166 min",
    aspectRatio: "1.90:1 (IMAX)",
    soundMix: "Dolby Atmos",
    vouchScore: "9.2",
    tomatometer: "94%",
    imdbScore: "8.6",
    metascore: "79",
    genre: "Sci-Fi / Epic",
    poster: "/api/image/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    specs: {
      budget: "$190M",
      boxOffice: "$714M",
      captureFormat: "Arri Alexa LF / Mini LF",
      soundDesigner: "Mark Mangini",
    },
    synopsis:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the known universe.",
  },
  {
    id: 872585,
    catalogNo: "OBJ-002",
    title: "Oppenheimer",
    year: "2023",
    director: "Christopher Nolan",
    runtime: "180 min",
    aspectRatio: "1.43:1 (70mm IMAX)",
    soundMix: "IMAX 6-Track",
    vouchScore: "9.4",
    tomatometer: "93%",
    imdbScore: "8.9",
    metascore: "88",
    genre: "Biographical / Drama",
    poster: "/api/image/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    specs: {
      budget: "$100M",
      boxOffice: "$976M",
      captureFormat: "IMAX 65mm & Panavision 65mm",
      soundDesigner: "Richard King",
    },
    synopsis:
      "The pulse-pounding paradox of the enigmatic man who must risk destroying the world in order to save it through the Manhattan Project.",
  },
  {
    id: 157336,
    catalogNo: "OBJ-003",
    title: "Interstellar",
    year: "2014",
    director: "Christopher Nolan",
    runtime: "169 min",
    aspectRatio: "2.39:1 / 1.43:1",
    soundMix: "DTS / Dolby Digital",
    vouchScore: "9.5",
    tomatometer: "73%",
    imdbScore: "8.7",
    metascore: "74",
    genre: "Sci-Fi / Adventure",
    poster: "/api/image/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    specs: {
      budget: "$165M",
      boxOffice: "$731M",
      captureFormat: "35mm & 70mm IMAX",
      soundDesigner: "Richard King",
    },
    synopsis:
      "A team of explorers undertake the most important mission in human history: traveling beyond this galaxy to discover whether mankind has a future among the stars.",
  },
  {
    id: 155,
    catalogNo: "OBJ-004",
    title: "The Dark Knight",
    year: "2008",
    director: "Christopher Nolan",
    runtime: "152 min",
    aspectRatio: "2.39:1 / 1.43:1",
    soundMix: "Dolby Digital / SDDS",
    vouchScore: "9.6",
    tomatometer: "94%",
    imdbScore: "9.0",
    metascore: "84",
    genre: "Action / Crime",
    poster: "/api/image/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    specs: {
      budget: "$185M",
      boxOffice: "$1.006B",
      captureFormat: "35mm & 15/70mm IMAX",
      soundDesigner: "Richard King",
    },
    synopsis:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
  {
    id: 27205,
    catalogNo: "OBJ-005",
    title: "Inception",
    year: "2010",
    director: "Christopher Nolan",
    runtime: "148 min",
    aspectRatio: "2.39:1",
    soundMix: "Dolby Digital",
    vouchScore: "9.1",
    tomatometer: "87%",
    imdbScore: "8.8",
    metascore: "74",
    genre: "Sci-Fi / Heist",
    poster: "/api/image/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    specs: {
      budget: "$160M",
      boxOffice: "$839M",
      captureFormat: "35mm & 65mm",
      soundDesigner: "Richard King",
    },
    synopsis:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  },
  {
    id: 792307,
    catalogNo: "OBJ-006",
    title: "Poor Things",
    year: "2023",
    director: "Yorgos Lanthimos",
    runtime: "141 min",
    aspectRatio: "1.66:1",
    soundMix: "Dolby Atmos",
    vouchScore: "8.9",
    tomatometer: "92%",
    imdbScore: "7.8",
    metascore: "87",
    genre: "Comedy / Fantasy",
    poster: "/api/image/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    specs: {
      budget: "$35M",
      boxOffice: "$117M",
      captureFormat: "35mm Ektachrome",
      soundDesigner: "Johnnie Burn",
    },
    synopsis:
      "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
  },
  {
    id: 933260,
    catalogNo: "OBJ-007",
    title: "The Substance",
    year: "2024",
    director: "Coralie Fargeat",
    runtime: "141 min",
    aspectRatio: "2.39:1",
    soundMix: "Dolby Atmos",
    vouchScore: "8.8",
    tomatometer: "90%",
    imdbScore: "7.6",
    metascore: "78",
    genre: "Body Horror / Satire",
    poster: "/api/image/w500/lqoMzCcZYEFK729Fc6rKRQDz2kf.jpg",
    specs: {
      budget: "$17M",
      boxOffice: "$77M",
      captureFormat: "Arri Alexa Mini",
      soundDesigner: "Valérie Deloof",
    },
    synopsis:
      "A fading celebrity decides to use a black market drug, a cell-replicating substance that temporarily creates a younger, better version of herself.",
  },
];

function ObjectsGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const selected = GALLERY_OBJECTS[selectedIndex];

  // Dynamic 3D tilt tracking based on cursor relative to container
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // 0 to width
    const y = e.clientY - rect.top; // 0 to height

    const normX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normY = (y / rect.height - 0.5) * 2; // -1 to 1

    setTilt({
      x: normY * -8, // tilt degrees X
      y: normX * 10, // tilt degrees Y
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % GALLERY_OBJECTS.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? GALLERY_OBJECTS.length - 1 : prev - 1
    );
  };

  // Keyboard navigation (left/right arrow)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="objects-gallery-section" aria-label="Interactive Objects Gallery">
      {/* SECTION HEADER */}
      <div className="objects-gallery-header">
        <div>
          <h2>The Vouch Film Vault</h2>
        </div>
        <p className="objects-header-sub">
          Tilted 3D artifact view. Select any specimen to expand its telemetry dossier and consensus metrics.
        </p>
      </div>

      {/* 3D INTERACTIVE STAGE */}
      <div
        className="objects-stage-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* TILTED OBJECTS CAROUSEL ROW */}
        <div
          className="objects-tilted-shelf"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {GALLERY_OBJECTS.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const distance = idx - selectedIndex;

            return (
              <div
                key={item.id}
                className={`gallery-object-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  transform: `translateZ(${isSelected ? "45px" : "0px"}) scale(${
                    isSelected ? 1.05 : 0.94
                  })`,
                }}
              >
                <div className="object-poster-wrap">
                  <img src={item.poster} alt={item.title} />
                  <div className="object-catalog-tag">{item.catalogNo}</div>
                  <div className="object-score-pill" style={{ display: "inline-flex", alignItems: "center" }}>
                    <FaStar style={{ color: "#f59e0b", marginRight: "3px", fontSize: "11px" }} />
                    {item.vouchScore}
                  </div>
                </div>

                <div className="object-card-label">
                  <strong>{item.title}</strong>
                  <span>{item.year}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* NAVIGATION CONTROLS */}
        <div className="objects-nav-bar">
          <button
            type="button"
            className="gallery-nav-btn prev"
            onClick={handlePrev}
            aria-label="Previous Object"
          >
            <FaArrowLeft style={{ fontSize: "13px" }} />
          </button>

          <div className="objects-pagination-dots">
            {GALLERY_OBJECTS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`pagination-dot ${idx === selectedIndex ? "active" : ""}`}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Go to ${item.title}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="gallery-nav-btn next"
            onClick={handleNext}
            aria-label="Next Object"
          >
            <FaArrowRight style={{ fontSize: "13px" }} />
          </button>
        </div>

        {/* SPECIFICATION SHEET (OBJECT INSPECTION DOSSIER) */}
        {selected && (
          <div className="object-spec-sheet-reveal">
            <div className="spec-sheet-inner">
              {/* TOP TELEMETRY STRIP */}
              <div className="spec-telemetry-strip">
                <div className="telemetry-item">
                  <span className="telemetry-label">SPECIMEN ARCHIVE</span>
                  <strong className="telemetry-val">{selected.catalogNo}</strong>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-label">RELEASE</span>
                  <strong className="telemetry-val">{selected.year}</strong>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-label">RUNTIME</span>
                  <strong className="telemetry-val">{selected.runtime}</strong>
                </div>
                <div className="telemetry-item">
                  <span className="telemetry-label">CAPTURE</span>
                  <strong className="telemetry-val">{selected.specs.captureFormat}</strong>
                </div>
              </div>

              {/* MAIN DOSSIER BODY */}
              <div className="spec-dossier-grid">
                <div className="spec-dossier-main">
                  <span className="spec-genre-badge">{selected.genre}</span>
                  <h3 className="spec-title">{selected.title}</h3>
                  <p className="spec-director">
                    Directed by <strong>{selected.director}</strong> · Sound Design by{" "}
                    <strong>{selected.specs.soundDesigner}</strong>
                  </p>
                  <p className="spec-synopsis">{selected.synopsis}</p>
                </div>

                {/* CONSENSUS HUD */}
                <div className="spec-consensus-hud">
                  <div className="hud-metric primary-vouch">
                    <span className="hud-label">VOUCH INDEX</span>
                    <span className="hud-number" style={{ display: "inline-flex", alignItems: "center" }}>
                      <FaStar style={{ color: "#f59e0b", marginRight: "5px", fontSize: "16px" }} />
                      {selected.vouchScore}
                    </span>
                    <span className="hud-sub">Universal Consensus</span>
                  </div>

                  <div className="hud-external-row">
                    <div className="hud-metric">
                      <span className="hud-label">IMDb</span>
                      <strong className="hud-score">{selected.imdbScore}</strong>
                    </div>
                    <div className="hud-metric">
                      <span className="hud-label">Rotten Tomatoes</span>
                      <strong className="hud-score">{selected.tomatometer}</strong>
                    </div>
                    <div className="hud-metric">
                      <span className="hud-label">Metascore</span>
                      <strong className="hud-score">{selected.metascore}</strong>
                    </div>
                  </div>

                  <Link
                    to={getTitleUrl(selected)}
                    className="spec-inspect-btn"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <span>Inspect Full Reviews & Vouches</span>
                    <FaArrowRight style={{ marginLeft: "8px", fontSize: "12px" }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ObjectsGallery;

