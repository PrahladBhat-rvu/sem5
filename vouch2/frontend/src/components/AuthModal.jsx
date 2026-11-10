import { useState, useMemo, useId } from "react";
import {
  FaTimes,
  FaCheck,
  FaRandom,
  FaArrowRight,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFilm,
  FaAward,
} from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { useAuthModal } from "../context/AuthModalContext";
import { generateRandomUsername } from "../utils/nameGenerator";
import { CINEMA_ARCHETYPES } from "../utils/cinemaPersonality";
import "./AuthModal.css";

function getPasswordStrength(pass) {
  if (!pass) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 8) score += 1;
  if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444" };
  if (score <= 3) return { score: 2, label: "Good", color: "#f59e0b" };
  return { score: 3, label: "Strong", color: "#10b981" };
}

export default function AuthModal() {
  const termsId = useId();
  const { isOpen, mode, setMode, closeAuthModal } = useAuthModal();

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Cinema taste archetype
  const [selectedArchetype, setSelectedArchetype] = useState(CINEMA_ARCHETYPES[0]);

  // Forgot password view
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

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

  // Auto-generate username suggestion if empty when user types first/last name
  const handleNameChange = (first, last) => {
    setFirstName(first);
    setLastName(last);
    if (!username && (first || last)) {
      const combined = `${first}${last}`.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (combined.length >= 3) {
        setUsername(`${combined}_${Math.floor(Math.random() * 89 + 10)}`);
      }
    }
  };

  const handleRandomizeImmediate = (e) => {
    if (e) e.preventDefault();
    const fresh = generateRandomUsername();
    setUsername(fresh);
  };

  // Demo accounts for fast sign-in
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

  // Google OAuth submission
  const handleGoogleSignIn = async () => {
    resetMessages();
    setLoading(true);
    try {
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      setLoading(false);
      if (oAuthError) {
        setError(oAuthError.message || "Failed to continue with Google.");
        return;
      }
      closeAuthModal();
    } catch {
      setLoading(false);
      setError("Unable to initiate Google sign-in. Please try again.");
    }
  };

  // Sign In handler
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

  // Sign Up handler (Dialog13 with Vouch metadata)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!username.trim()) {
      setError("Please choose a cinema username.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      setError("Username must be between 3 and 20 characters (letters, numbers, and underscores).");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            username: username.trim(),
            display_name: fullName || username.trim(),
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

      setSuccess("Account created successfully! Check your email to verify your profile.");
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
      className="dialog13-overlay"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="dialog13-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR: SWITCHER & CLOSE */}
        <div className="dialog13-topbar">
          {!isForgotView ? (
            <div className="dialog13-segmented-control" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className={`dialog13-segment-btn ${mode === "signup" ? "active" : ""}`}
                onClick={() => handleSwitchMode("signup")}
              >
                Sign Up
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className={`dialog13-segment-btn ${mode === "login" ? "active" : ""}`}
                onClick={() => handleSwitchMode("login")}
              >
                Sign In
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="dialog13-inline-btn"
              onClick={() => {
                setIsForgotView(false);
                resetMessages();
              }}
            >
              <FaArrowLeft style={{ fontSize: "11px" }} />
              <span>Back to Sign In</span>
            </button>
          )}

          <button
            type="button"
            className="dialog13-close-btn"
            onClick={closeAuthModal}
            aria-label="Close dialog"
          >
            <FaTimes style={{ fontSize: "13px" }} />
          </button>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="dialog13-alert error" role="alert">
            <FaExclamationTriangle style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="dialog13-alert success" role="status">
            <FaCheckCircle style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* ====================================================
            VIEW 1: SIGN UP (Dialog13 with Vouch Features)
            ==================================================== */}
        {mode === "signup" && !isForgotView && (
          <div>
            <div className="dialog13-header">
              <h2 className="dialog13-title">Create your account</h2>
              <p className="dialog13-description">
                Sign up free to get started, no card needed.
              </p>
            </div>

            <form className="dialog13-form" onSubmit={handleSignupSubmit}>
              {/* FIRST & LAST NAME (GRID 2-COL) */}
              <div className="dialog13-grid-2">
                <div className="dialog13-field">
                  <label htmlFor="first-name" className="dialog13-label">
                    First name
                  </label>
                  <input
                    id="first-name"
                    name="firstname"
                    className="dialog13-input"
                    placeholder="e.g. Alex"
                    value={firstName}
                    onChange={(e) => handleNameChange(e.target.value, lastName)}
                    required
                  />
                </div>
                <div className="dialog13-field">
                  <label htmlFor="last-name" className="dialog13-label">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    name="lastname"
                    className="dialog13-input"
                    placeholder="e.g. Smith"
                    value={lastName}
                    onChange={(e) => handleNameChange(firstName, e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* USERNAME / CINEMA HANDLE */}
              <div className="dialog13-field">
                <div className="dialog13-label-row">
                  <label htmlFor="username" className="dialog13-label">
                    Cinema handle
                  </label>
                  <button
                    type="button"
                    className="dialog13-random-btn"
                    onClick={handleRandomizeImmediate}
                    title="Generate a random cinema handle"
                  >
                    <FaRandom style={{ fontSize: "10px" }} />
                    <span>Randomize</span>
                  </button>
                </div>
                <div className="dialog13-input-wrapper">
                  <span className="dialog13-input-prefix">@</span>
                  <input
                    id="username"
                    name="username"
                    className="dialog13-input with-prefix"
                    placeholder="cinephile_99"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                  {username && isUsernameValid && (
                    <span
                      style={{
                        position: "absolute",
                        right: "12px",
                        color: "#10b981",
                        fontSize: "12px",
                      }}
                    >
                      <FaCheck />
                    </span>
                  )}
                </div>
              </div>

              {/* EMAIL ADDRESS */}
              <div className="dialog13-field">
                <label htmlFor="email" className="dialog13-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="useremail"
                  className="dialog13-input"
                  placeholder="alex@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* CREATE PASSWORD */}
              <div className="dialog13-field">
                <div className="dialog13-label-row">
                  <label htmlFor="password" className="dialog13-label">
                    Create password
                  </label>
                  {password && (
                    <span
                      className="dialog13-strength-pill"
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </span>
                  )}
                </div>
                <div className="dialog13-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="userpassword"
                    className="dialog13-input with-suffix"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="dialog13-input-suffix-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* TASTE ARCHETYPE SELECTOR */}
              <div className="dialog13-field dialog13-archetype-wrap">
                <label className="dialog13-label">Cinema Archetype</label>
                <div className="dialog13-archetype-grid">
                  {CINEMA_ARCHETYPES.map((arch) => {
                    const isSelected = selectedArchetype.id === arch.id;
                    return (
                      <button
                        key={arch.id}
                        type="button"
                        className={`dialog13-archetype-btn ${isSelected ? "active" : ""}`}
                        onClick={() => setSelectedArchetype(arch)}
                        title={arch.desc}
                      >
                        <span className="dialog13-archetype-icon">{arch.icon}</span>
                        <span className="dialog13-archetype-title">{arch.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TERMS & PRIVACY CHECKBOX */}
              <div className="dialog13-checkbox-row">
                <input
                  type="checkbox"
                  id={termsId}
                  className="dialog13-checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                />
                <label htmlFor={termsId} className="dialog13-checkbox-label">
                  <span>
                    I agree to the{" "}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="dialog13-footer">
                <button
                  type="submit"
                  className="dialog13-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>

                <div className="dialog13-divider">
                  <span className="dialog13-divider-text">Or sign up with</span>
                </div>

                <button
                  type="button"
                  className="dialog13-btn-google"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <img
                    src="https://api.iconify.design/logos:google-icon.svg"
                    alt="Google Icon"
                    className="dialog13-google-icon"
                  />
                  <span>Continue with Google</span>
                </button>
              </div>
            </form>

            <div className="dialog13-bottom-prompt">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="dialog13-inline-btn"
                  onClick={() => handleSwitchMode("login")}
                >
                  <span>Sign In</span>
                  <FaArrowRight style={{ fontSize: "10px" }} />
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ====================================================
            VIEW 2: SIGN IN (Styled in clean zinc Dialog13 aesthetics)
            ==================================================== */}
        {mode === "login" && !isForgotView && (
          <div>
            <div className="dialog13-header">
              <h2 className="dialog13-title">Welcome back</h2>
              <p className="dialog13-description">
                Sign in to access your saved watchlist and verified verdicts.
              </p>
            </div>

            <form className="dialog13-form" onSubmit={handleLoginSubmit}>
              {/* EMAIL */}
              <div className="dialog13-field">
                <label htmlFor="login-email" className="dialog13-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="login-email"
                  className="dialog13-input"
                  placeholder="alex@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="dialog13-field">
                <div className="dialog13-label-row">
                  <label htmlFor="login-password" className="dialog13-label">
                    Password
                  </label>
                  <button
                    type="button"
                    className="dialog13-random-btn"
                    onClick={() => {
                      setForgotEmail(email);
                      setIsForgotView(true);
                      resetMessages();
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="dialog13-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    className="dialog13-input with-suffix"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="dialog13-input-suffix-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME & DEMO CHIPS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "2px",
                }}
              >
                <div className="dialog13-checkbox-row" style={{ margin: 0 }}>
                  <input
                    type="checkbox"
                    id="login-remember"
                    className="dialog13-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="login-remember" className="dialog13-checkbox-label">
                    Remember me
                  </label>
                </div>

                <div className="dialog13-demo-chips">
                  <span style={{ fontSize: "11px", color: "#71717a" }}>Demo:</span>
                  <button
                    type="button"
                    className="dialog13-demo-chip highlight"
                    onClick={() => fillDemo("viewer")}
                    title="Load Demo Viewer credentials (password: RVU@123)"
                  >
                    <FaFilm style={{ fontSize: "10px" }} />
                    Viewer
                  </button>
                  <button
                    type="button"
                    className="dialog13-demo-chip"
                    onClick={() => fillDemo("critic")}
                    title="Load Critic credentials"
                  >
                    <FaAward style={{ fontSize: "10px" }} />
                    Critic
                  </button>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="dialog13-footer">
                <button
                  type="submit"
                  className="dialog13-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in to Vouch"}
                </button>

                <div className="dialog13-divider">
                  <span className="dialog13-divider-text">Or sign in with</span>
                </div>

                <button
                  type="button"
                  className="dialog13-btn-google"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <img
                    src="https://api.iconify.design/logos:google-icon.svg"
                    alt="Google Icon"
                    className="dialog13-google-icon"
                  />
                  <span>Continue with Google</span>
                </button>
              </div>
            </form>

            <div className="dialog13-bottom-prompt">
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="dialog13-inline-btn"
                  onClick={() => handleSwitchMode("signup")}
                >
                  <span>Create one free</span>
                  <FaArrowRight style={{ fontSize: "10px" }} />
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ====================================================
            VIEW 3: FORGOT PASSWORD
            ==================================================== */}
        {isForgotView && (
          <div>
            <div className="dialog13-header">
              <h2 className="dialog13-title">Reset password</h2>
              <p className="dialog13-description">
                Enter your email address and we'll send you a secure password reset link.
              </p>
            </div>

            <form className="dialog13-form" onSubmit={handleForgotSubmit}>
              <div className="dialog13-field">
                <label htmlFor="forgot-email" className="dialog13-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  className="dialog13-input"
                  placeholder="alex@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <div className="dialog13-footer">
                <button
                  type="submit"
                  className="dialog13-btn-primary"
                  disabled={loading || forgotSent}
                >
                  {loading ? "Sending link..." : "Send reset link"}
                </button>
              </div>
            </form>

            <div className="dialog13-bottom-prompt">
              <button
                type="button"
                className="dialog13-inline-btn"
                onClick={() => {
                  setIsForgotView(false);
                  resetMessages();
                }}
              >
                <FaArrowLeft style={{ fontSize: "10px" }} />
                <span>Back to Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
