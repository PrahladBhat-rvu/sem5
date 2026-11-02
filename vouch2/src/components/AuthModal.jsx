import { useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useAuthModal } from "../context/AuthModalContext";
import { generateRandomUsername, generateUsernameSuggestions } from "../utils/nameGenerator";
import { CINEMA_ARCHETYPES } from "../utils/cinemaPersonality";

function getPasswordStrength(pass) {
  if (!pass) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 10) score += 1;
  if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", color: "#d9534f" };
  if (score <= 3) return { score: 2, label: "Good", color: "#f0ad4e" };
  return { score: 3, label: "Strong", color: "#2e7d32" };
}

function AuthModal() {
  const { isOpen, mode, setMode, closeAuthModal } = useAuthModal();

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password view
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Cinema taste & Reddit username generator
  const [selectedArchetype, setSelectedArchetype] = useState(CINEMA_ARCHETYPES[0]);
  const [suggestions, setSuggestions] = useState(() => generateUsernameSuggestions(3));

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const isUsernameValid = username && /^[a-zA-Z0-9_]{3,20}$/.test(username);

  if (!isOpen) return null;

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleSwitchMode = (newMode) => {
    resetMessages();
    setIsForgotView(false);
    setMode(newMode);
  };

  // Reddit handle selection
  const handlePickSuggestion = (picked) => {
    setUsername(picked);
    if (!displayName) {
      const clean = picked.replace(/_\d+$/, "").replace(/_/g, " ");
      setDisplayName(clean);
    }
  };

  const handleRollSuggestions = (e) => {
    if (e) e.preventDefault();
    setSuggestions(generateUsernameSuggestions(3));
  };

  const handleRandomizeImmediate = (e) => {
    if (e) e.preventDefault();
    const fresh = generateRandomUsername();
    setUsername(fresh);
    if (!displayName) {
      const clean = fresh.replace(/_\d+$/, "").replace(/_/g, " ");
      setDisplayName(clean);
    }
  };

  // Demo account filler
  const fillDemo = (role) => {
    resetMessages();
    if (role === "viewer") {
      setEmail("viewer@vouch.media");
      setPassword("RVU@123");
    } else if (role === "critic") {
      setEmail("critic@vouch.media");
      setPassword("RVU@123");
    } else {
      setEmail("demo@vouch.media");
      setPassword("RVU@123");
    }
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

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

      setLoading(false);

      if (authError) {
        setError(authError.message || "Failed to sign in. Please check your credentials.");
        return;
      }

      closeAuthModal();
    } catch {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  // Signup handler
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!username.trim()) {
      setError("Please choose a username.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      setError("Username must be between 3 and 20 characters (letters, numbers, and underscores).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
            display_name: displayName.trim() || username.trim(),
            archetype: selectedArchetype.id,
            archetype_title: selectedArchetype.title,
            avatar_icon: selectedArchetype.icon,
          },
        },
      });

      setLoading(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.session) {
        closeAuthModal();
        return;
      }

      setSuccess("Account created! Check your email to activate your profile.");
    } catch {
      setLoading(false);
      setError("An unexpected error occurred during signup.");
    }
  };

  // Forgot password handler
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!forgotEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        forgotEmail.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      setLoading(false);

      if (resetErr) {
        setError(resetErr.message);
        return;
      }

      setForgotSent(true);
      setSuccess(`Password recovery link sent to ${forgotEmail.trim()}.`);
    } catch {
      setLoading(false);
      setError("Could not send reset link. Please try again later.");
    }
  };

  return (
    <div
      className="auth-overlay-backdrop"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="auth-card-clean"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER BAR: SEGMENTED SWITCHER & CLOSE */}
        <div className="auth-header-bar">
          {!isForgotView ? (
            <div className="auth-segmented-control">
              <button
                type="button"
                className={`auth-segment-btn ${mode === "login" ? "active" : ""}`}
                onClick={() => handleSwitchMode("login")}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-segment-btn ${mode === "signup" ? "active" : ""}`}
                onClick={() => handleSwitchMode("signup")}
              >
                Create Account
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="auth-back-link"
              onClick={() => {
                setIsForgotView(false);
                resetMessages();
              }}
            >
              ← Back to Sign In
            </button>
          )}

          <button
            type="button"
            className="auth-close-btn"
            onClick={closeAuthModal}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="auth-alert error animate-shake" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert success" role="status">
            <span className="alert-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* ====================================================
            VIEW 1: FORGOT PASSWORD
            ==================================================== */}
        {isForgotView ? (
          <div className="auth-clean-body">
            <div className="auth-clean-intro">
              <h2>Reset Password</h2>
              <p>Enter your email and we'll send you a secure password reset link.</p>
            </div>

            <form onSubmit={handleForgotSubmit} className="auth-clean-form">
              <div className="auth-input-group">
                <label htmlFor="modal-forgot-email">Email Address</label>
                <div className="auth-input-shell">
                  <span className="auth-input-icon">✉</span>
                  <input
                    id="modal-forgot-email"
                    type="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-action-btn"
                disabled={loading || forgotSent}
              >
                {loading ? "Sending link..." : "Send Reset Link →"}
              </button>
            </form>
          </div>
        ) : mode === "login" ? (
          /* ====================================================
             VIEW 2: SIGN IN
             ==================================================== */
          <div className="auth-clean-body">
            <div className="auth-clean-intro">
              <h2>Welcome back.</h2>
              <p>Sign in to access your saved watchlist and verified verdicts.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="auth-clean-form">
              {/* EMAIL */}
              <div className="auth-input-group">
                <label htmlFor="modal-login-email">Email Address</label>
                <div className="auth-input-shell">
                  <span className="auth-input-icon">✉</span>
                  <input
                    id="modal-login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label htmlFor="modal-login-password">Password</label>
                  <button
                    type="button"
                    className="auth-text-link"
                    onClick={() => {
                      setForgotEmail(email);
                      setIsForgotView(true);
                      resetMessages();
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="auth-input-shell">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    id="modal-login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME & QUICK DEMOS */}
              <div className="auth-options-bar">
                <label className="auth-remember-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <div className="auth-demo-chips">
                  <span className="auth-demo-intro">Demo:</span>
                  <button
                    type="button"
                    className="auth-demo-chip highlight"
                    onClick={() => fillDemo("viewer")}
                    title="Load Demo Viewer credentials (password: RVU@123)"
                  >
                    🍿 Demo Viewer
                  </button>
                  <button
                    type="button"
                    className="auth-demo-chip"
                    onClick={() => fillDemo("critic")}
                    title="Load Critic credentials"
                  >
                    🎬 Critic
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="auth-action-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In to Vouch →"}
              </button>
            </form>

            <div className="auth-footer-prompt">
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="auth-inline-switch-btn"
                  onClick={() => handleSwitchMode("signup")}
                >
                  Create one for free →
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* ====================================================
             VIEW 3: CREATE ACCOUNT
             ==================================================== */
          <div className="auth-clean-body">
            <div className="auth-clean-intro">
              <h2>Join the community.</h2>
              <p>Save movies, write verified vouches, and track consensus</p>
            </div>

            <form onSubmit={handleSignupSubmit} className="auth-clean-form">
              {/* EMAIL */}
              <div className="auth-input-group">
                <label htmlFor="modal-signup-email">Email Address</label>
                <div className="auth-input-shell">
                  <span className="auth-input-icon">✉</span>
                  <input
                    id="modal-signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* USERNAME & DISPLAY NAME: CLEAN RESPONSIVE ROW */}
              <div className="auth-name-row">
                {/* USERNAME */}
                <div className="auth-input-group flex-1">
                  <div className="auth-label-row">
                    <label htmlFor="modal-signup-username">Username</label>
                    <button
                      type="button"
                      className="auth-random-inline-btn"
                      onClick={handleRandomizeImmediate}
                      title="Roll a random cinema handle"
                    >
                      🎲 Randomize
                    </button>
                  </div>
                  <div className="auth-input-shell">
                    <span className="auth-input-icon">@</span>
                    <input
                      id="modal-signup-username"
                      type="text"
                      placeholder="cinephile_99"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      required
                    />
                    {username && (
                      <span className={`auth-input-status ${isUsernameValid ? "ok" : ""}`}>
                        {isUsernameValid ? "✓" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* DISPLAY NAME */}
                <div className="auth-input-group flex-1">
                  <label htmlFor="modal-signup-display-name">
                    Display Name <small className="auth-optional">(optional)</small>
                  </label>
                  <div className="auth-input-shell">
                    <span className="auth-input-icon">👤</span>
                    <input
                      id="modal-signup-display-name"
                      type="text"
                      placeholder="Alex Rivera"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* REDDIT-STYLE HANDLE SUGGESTIONS: CLEAN HORIZONTAL BAR */}
              <div className="auth-handle-suggestions">
                <span className="suggestions-prompt">💡 Try:</span>
                <div className="suggestions-chips-wrap">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      className={`suggestion-badge ${username === sug ? "active" : ""}`}
                      onClick={() => handlePickSuggestion(sug)}
                    >
                      @{sug}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="suggestion-refresh-icon"
                    onClick={handleRollSuggestions}
                    title="Roll new handles"
                    aria-label="Refresh handle suggestions"
                  >
                    ↻
                  </button>
                </div>
              </div>

              {/* PASSWORD */}
              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label htmlFor="modal-signup-password">Password</label>
                  {password && (
                    <span className="auth-pw-strength" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <div className="auth-input-shell">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    id="modal-signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* TASTE ARCHETYPE: CLEAN 3x2 GRID (NO OVERFLOW, NO SQUISHING) */}
              <div className="auth-input-group">
                <label className="auth-section-label">Taste Archetype</label>
                <div className="archetype-balanced-grid">
                  {CINEMA_ARCHETYPES.map((arch) => {
                    const isSelected = selectedArchetype.id === arch.id;
                    return (
                      <button
                        key={arch.id}
                        type="button"
                        className={`archetype-clean-card ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedArchetype(arch)}
                        title={arch.desc}
                      >
                        <span className="archetype-emoji">{arch.icon}</span>
                        <span className="archetype-name">{arch.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="auth-action-btn"
                disabled={loading}
              >
                {loading ? "Creating your account..." : "Join Vouch →"}
              </button>
            </form>

            <div className="auth-footer-prompt">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-inline-switch-btn"
                  onClick={() => handleSwitchMode("login")}
                >
                  Sign in here →
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
