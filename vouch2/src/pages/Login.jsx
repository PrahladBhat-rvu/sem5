import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { CINEMA_QUOTES, VAULT_TITLES } from "../utils/cinemaPersonality";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Personality state: rotating quotes and featured vault films
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [vaultIdx, setVaultIdx] = useState(0);

  const handleNextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % CINEMA_QUOTES.length);
  };

  const handleNextVault = () => {
    setVaultIdx((prev) => (prev + 1) % VAULT_TITLES.length);
  };

  const handlePrevVault = () => {
    setVaultIdx((prev) => (prev - 1 + VAULT_TITLES.length) % VAULT_TITLES.length);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      navigate("/");
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError("Please provide your email address.");
      return;
    }

    setResetLoading(true);
    setError("");

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      setResetLoading(false);

      if (resetErr) {
        setError(resetErr.message);
        return;
      }

      setShowForgotModal(false);
      setInfoMessage(`Password reset link dispatched to ${resetEmail.trim()}. Check your inbox.`);
    } catch {
      setResetLoading(false);
      setError("Could not send reset link. Try again later.");
    }
  };

  // Quick helper persona fills for testing & evaluation
  const fillPersona = (role) => {
    if (role === "viewer") {
      setEmail("viewer@vouch.media");
      setPassword("RVU@123");
      setInfoMessage("🍿 Demo Viewer credentials loaded (password: RVU@123). Press 'Enter the Screening Room'.");
    } else if (role === "critic") {
      setEmail("critic@vouch.media");
      setPassword("RVU@123");
      setInfoMessage("🎬 Critic demo credentials loaded (password: RVU@123). Press 'Enter the Screening Room'.");
    } else {
      setEmail("demo@vouch.media");
      setPassword("RVU@123");
      setInfoMessage("🍿 Demo credentials loaded (password: RVU@123). Press 'Enter the Screening Room'.");
    }
    setError("");
  };

  const currentQuote = CINEMA_QUOTES[quoteIdx];
  const currentVault = VAULT_TITLES[vaultIdx];

  return (
    <div className="site">
      <Navbar />

      <main className="auth-page-enhanced">
        <div className="auth-split-wrapper">
          {/* LEFT COLUMN: VOUCH SCREENING ROOM & VAULT MARQUEE */}
          <div className="auth-aside-panel">
            <h2 className="auth-headline">
              Welcome back to
              <br />
              <em>the screening room.</em>
            </h2>

            <p className="auth-aside-text">
              Every score on Vouch is cross-calibrated against synthetic review-bombing and critic monopolies.
            </p>

            {/* LIVE VAULT CONSENSUS MARQUEE */}
            <div className="vault-marquee-card">
              <div className="vault-marquee-header">
                <span className="vault-header-label">Consensus Spotlight</span>
                <div className="vault-nav-buttons">
                  <button
                    type="button"
                    className="vault-nav-btn"
                    onClick={handlePrevVault}
                    title="Previous title"
                    aria-label="Previous vault title"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    className="vault-nav-btn"
                    onClick={handleNextVault}
                    title="Next title"
                    aria-label="Next vault title"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="vault-film-info">
                <h3>{currentVault.title}</h3>
                <span className="vault-film-meta">
                  {currentVault.year} • Dir. {currentVault.director}
                </span>
                <p className="vault-consensus-quote">"{currentVault.consensus}"</p>
              </div>

              <div className="vault-score-grid">
                <div className="vault-score-box vouch-score-highlight">
                  <span className="vault-score-label">VOUCH</span>
                  <strong>{currentVault.vouchScore}</strong>
                  <small>/10</small>
                </div>
                <div className="vault-score-box">
                  <span className="vault-score-label">IMDb</span>
                  <strong>{currentVault.scores.imdb}</strong>
                  <small>/10</small>
                </div>
                <div className="vault-score-box">
                  <span className="vault-score-label">RT</span>
                  <strong>{currentVault.scores.rt}</strong>
                  <small>Fresh</small>
                </div>
                <div className="vault-score-box">
                  <span className="vault-score-label">META</span>
                  <strong>{currentVault.scores.meta}</strong>
                  <small>/100</small>
                </div>
              </div>
            </div>

            {/* ROTATING FILM QUOTE BOX */}
            <div className="auth-quote-card interactive-quote-card">
              <div className="quote-header">
                <span className="quote-badge">🎬 FILM WISDOM</span>
                <button
                  type="button"
                  className="quote-shuffle-btn"
                  onClick={handleNextQuote}
                  title="Shuffle quote"
                >
                  ↻ Shuffle
                </button>
              </div>
              <p className="quote-body">"{currentQuote.quote}"</p>
              <span className="quote-source">— {currentQuote.source}</span>
            </div>

            {/* QUICK DEMO CREDENTIAL CHIPS */}
            <div className="demo-credentials-deck">
              <span className="demo-deck-title">⚡ Quick Tester Pass:</span>
              <div className="demo-chips-row">
                <button
                  type="button"
                  className="demo-persona-chip highlight"
                  onClick={() => fillPersona("viewer")}
                >
                  🍿 Demo Viewer
                </button>
                <button
                  type="button"
                  className="demo-persona-chip"
                  onClick={() => fillPersona("critic")}
                >
                  🎬 Critic Demo
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LOGIN FORM CARD */}
          <div className="auth-form-card">
            {/* TOP AUTH TABS SWITCHER */}
            <div className="auth-tab-switcher">
              <div className="auth-tab active">
                Sign In
                <span className="auth-tab-indicator"></span>
              </div>
              <Link to="/signup" className="auth-tab">
                Create Account
              </Link>
            </div>

            <div className="auth-card-header">
              <h1>Welcome back.</h1>
              <p>Sign in to access your watchlist & verified verdicts</p>
            </div>

            {error && (
              <div className="auth-alert error animate-shake" role="alert">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="auth-alert success" role="status">
                <span className="alert-icon">✓</span>
                <span>{infoMessage}</span>
              </div>
            )}

            <form className="auth-form-modern" onSubmit={handleLogin}>
              {/* EMAIL FIELD */}
              <div className="form-field-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-with-icon">
                  <span className="field-icon">✉</span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD FIELD WITH TOGGLE */}
              <div className="form-field-group">
                <div className="field-label-split">
                  <label htmlFor="login-password">Password</label>
                  <button
                    type="button"
                    className="forgot-link-btn"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotModal(true);
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="input-with-icon">
                  <span className="field-icon">🔒</span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="form-options-row">
                <label className="remember-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner-wrap">
                    <span className="spinner-dots"></span>
                    Opening the Vault...
                  </span>
                ) : (
                  "Enter the Screening Room →"
                )}
              </button>
            </form>

            <div className="auth-card-footer">
              <p>
                Don't have a Cinephile Pass yet?{" "}
                <Link to="/signup" className="switch-link">
                  Create one in 60 seconds →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* FORGOT PASSWORD MODAL */}
        {showForgotModal && (
          <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
            <div className="modal-content forgot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Reset Your Pass Key</h2>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowForgotModal(false)}
                >
                  ✕
                </button>
              </div>

              <p className="forgot-modal-desc">
                Enter your registered Cinephile email address and we'll dispatch a secure recovery link right away.
              </p>

              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-field-group">
                  <label htmlFor="reset-email">Email Address</label>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Sending Key..." : "Send Reset Link →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Login;
