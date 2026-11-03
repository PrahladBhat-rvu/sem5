import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="site">
      <Navbar />
      <main className="about-page">
        {/* HERO */}
        <section className="about-hero">
          <h1>
            The internet's opinion.
            <br />
            <em>Cut down to the truth.</em>
          </h1>
          <p className="about-lead">
            We built Vouch because finding an honest review in 2026 feels like solving a puzzle:
            10 open browser tabs, sponsored listicles, and polarized review-bombing.
            Vouch brings every angle together in one clean, uncluttered place.
          </p>
        </section>

        {/* NUMBERS BANNER */}
        <section className="about-stats-banner">
          <div className="stat-item">
            <span className="stat-number">4+</span>
            <span className="stat-label">Major Sources Aggregated</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Movies & Shows Indexed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Zero Sponsored Bias</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">&lt; 1s</span>
            <span className="stat-label">Consensus Load Time</span>
          </div>
        </section>

        {/* THE PROBLEM & THE SOLUTION */}
        <section className="about-narrative">
          <div className="narrative-block">
            <div className="narrative-label">
              <span className="badge-problem">THE PROBLEM</span>
              <h2>Why finding good media is harder than ever.</h2>
            </div>
            <div className="narrative-text">
              <p>
                Every media review platform today suffers from a distinct blind spot.
                Critic-only sites often reward pretentious storytelling that leaves regular audiences cold.
                Open public rating sites are plagued by review-bombing campaigns and bot syndicates.
                Social media listicles are compromised by affiliate commissions.
              </p>
              <p>
                To get a genuine sense of whether a film or show is worth 2 hours of your time,
                you end up checking IMDb, clicking Rotten Tomatoes, scanning Reddit threads,
                and comparing Metascores manually.
              </p>
            </div>
          </div>

          <div className="narrative-block">
            <div className="narrative-label">
              <span className="badge-solution">THE VOUCH SOLUTION</span>
              <h2>One unified consensus score you can trust.</h2>
            </div>
            <div className="narrative-text">
              <p>
                Vouch unifies external data from <strong>OMDb</strong>, <strong>TMDB</strong>,
                <strong>IMDb</strong>, and <strong>Metacritic</strong> with genuine community opinions.
                We don't replace critics or audience scores—we harmonize them.
              </p>
              <p>
                When someone says they <em>"Vouch"</em> for a title, they stake their credibility on it.
                No 5-star fluff, no generic stars. Just clear, multi-dimensional perspectives on story,
                pacing, direction, and replay value.
              </p>
            </div>
          </div>
        </section>

        {/* HOW WE DO IT - 3 PILLARS */}
        <section className="about-pillars">
          <div className="pillars-header">
            <h2>Built on three foundational principles.</h2>
          </div>
          <div className="pillars-grid">
            <div className="pillar-card">
              <span className="pillar-num">01</span>
              <h3>Cross-Platform Synthesis</h3>
              <p>
                Our server queries multiple reputable global film and media APIs simultaneously,
                cross-referencing metadata to ensure ratings represent consensus rather than outlier bias.
              </p>
            </div>
            <div className="pillar-card">
              <span className="pillar-num">02</span>
              <h3>Nuanced Community Vouches</h3>
              <p>
                Instead of simple binary thumbs up or thumbs down, Vouch members evaluate specific
                aspects like storytelling, visual craft, pacing, and emotional payoff.
              </p>
            </div>
            <div className="pillar-card">
              <span className="pillar-num">03</span>
              <h3>Zero-Distraction Design</h3>
              <p>
                No autoplaying video ads, no intrusive popups, and no algorithmic rage-bait.
                Vouch features an editorial typographic aesthetic designed to respect your focus.
              </p>
            </div>
          </div>
        </section>

        {/* TECH STACK / PROJECT CREDITS */}
        <section className="about-tech-stack">
          <div className="tech-stack-inner">
            <h2>The Technology Behind Vouch</h2>
            <p className="tech-lead">
              Crafted as a full-stack modern web application with high performance,
              resilient fallbacks, and edge deployment capabilities.
            </p>

            <div className="tech-tags-grid">
              <div className="tech-badge">
                <strong>Frontend</strong>
                <span>React 19 + React Router 7 + Vite</span>
              </div>
              <div className="tech-badge">
                <strong>Backend API</strong>
                <span>Node.js + Express 5</span>
              </div>
              <div className="tech-badge">
                <strong>Database & Auth</strong>
                <span>Supabase (PostgreSQL + Row-Level Security)</span>
              </div>
              <div className="tech-badge">
                <strong>Edge Deployment</strong>
                <span>Cloudflare Workers + Wrangler</span>
              </div>
              <div className="tech-badge">
                <strong>Data Sources</strong>
                <span>TMDB API + OMDb API</span>
              </div>
              <div className="tech-badge">
                <strong>Design System</strong>
                <span>Pure Responsive CSS with Editorial Tokens</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION / LIST */}
        <section className="about-faq">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Does Vouch accept sponsored movie ratings?</h3>
              <p>
                Never. We do not accept paid placements, sponsored rating boosts, or studio partnerships.
                All scores are computed directly from independent API data and authentic community members.
              </p>
            </div>
            <div className="faq-item">
              <h3>How does the Vouch consensus score work?</h3>
              <p>
                We aggregate ratings across IMDb, TMDB, and community reviews into a normalized 10-point scale,
                applying weighting to mitigate extreme outliers from brigading or low-sample entries.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I save titles to watch later?</h3>
              <p>
                Yes! Creating an account allows you to save movies to your personal Watchlist and track
                reviews from other members whose taste you trust.
              </p>
            </div>
            <div className="faq-item">
              <h3>Is Vouch free to use?</h3>
              <p>
                Vouch is 100% free and open for movie enthusiasts and creators everywhere.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="about-cta">
          <h2>Ready to stop guessing and start watching?</h2>
          <div className="about-cta-buttons">
            <Link to="/discover" className="btn-primary" style={{ display: "inline-flex", alignItems: "center" }}>
              <span>Discover Movies</span>
              <FaArrowRight style={{ marginLeft: "8px", fontSize: "12px" }} />
            </Link>
            <Link to="/signup" className="btn-secondary">
              Join the Vouch Community
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;

