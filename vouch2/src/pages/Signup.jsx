import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaEnvelope, FaRandom, FaCheck, FaRedo } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { generateRandomUsername, generateUsernameSuggestions } from "../utils/nameGenerator";
import { CINEMA_ARCHETYPES } from "../utils/cinemaPersonality";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - 3 - i);

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

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Discord-style Date of Birth selects
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");

  const [selectedArchetype, setSelectedArchetype] = useState(CINEMA_ARCHETYPES[0]);
  const [suggestions, setSuggestions] = useState(() => generateUsernameSuggestions(3));
  const [optInEmails, setOptInEmails] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const isUsernameValid = username && /^[a-zA-Z0-9_]{3,20}$/.test(username);

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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!username.trim()) {
      setError("Please choose a username.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      setError("Username must be between 3 and 20 characters (letters, numbers, and underscores only).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const dobString = dobMonth && dobDay && dobYear ? `${dobMonth} ${dobDay}, ${dobYear}` : "";

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
            date_of_birth: dobString,
            newsletter_opt_in: optInEmails,
          },
        },
      });

      setLoading(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.session) {
        navigate("/");
        return;
      }

      setSuccess("Account successfully created! Please check your email to verify and activate your profile.");
    } catch {
      setLoading(false);
      setError("An unexpected error occurred during signup.");
    }
  };

  return (
    <div className="site">
      <Navbar />

      <main className="discord-auth-viewport">
        {/* DISCORD-STYLE FLOATING AMBIENT CORNER MOTIFS */}
        <div className="discord-bg-decorations" aria-hidden="true">
          <div className="decor-item decor-top-left">🎬</div>
          <div className="decor-item decor-top-right">🍿</div>
          <div className="decor-item decor-bottom-left">📼</div>
          <div className="decor-item decor-bottom-right">📽️</div>
        </div>

        {/* CENTERED FLOATING DISCORD-STYLE CARD */}
        <div className="discord-card">
          <div className="discord-card-header">
            <h1>Create an account</h1>
            <p>Join the cinema consensus community</p>
          </div>

          {error && (
            <div className="discord-alert error" role="alert">
              <span className="alert-icon">
                <FaExclamationTriangle style={{ color: "#ef4444", fontSize: "14px" }} />
              </span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="discord-alert success" role="status">
              <span className="alert-icon">
                <FaEnvelope style={{ color: "#10b981", fontSize: "14px" }} />
              </span>
              <span>{success}</span>
            </div>
          )}

          <form className="discord-form" onSubmit={handleSignup}>
            {/* EMAIL FIELD */}
            <div className="discord-field">
              <label htmlFor="discord-email">
                EMAIL <span className="discord-req">*</span>
              </label>
              <input
                id="discord-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* DISPLAY NAME FIELD */}
            <div className="discord-field">
              <label htmlFor="discord-display-name">DISPLAY NAME</label>
              <input
                id="discord-display-name"
                type="text"
                placeholder="How others see you"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            {/* USERNAME FIELD */}
            <div className="discord-field">
              <div className="discord-label-row">
                <label htmlFor="discord-username">
                  USERNAME <span className="discord-req">*</span>
                </label>
                <div className="discord-label-actions">
                  <button
                    type="button"
                    className="discord-randomize-btn"
                    onClick={handleRandomizeImmediate}
                    title="Generate random cinema handle"
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <FaRandom style={{ marginRight: "4px", fontSize: "10px" }} />
                    Randomize
                  </button>
                  {username && (
                    <span className={`discord-valid-tag ${isUsernameValid ? "valid" : "invalid"}`} style={{ display: "inline-flex", alignItems: "center" }}>
                      {isUsernameValid ? (
                        <>
                          <FaCheck style={{ color: "#10b981", marginRight: "3px", fontSize: "10px" }} />
                          Valid
                        </>
                      ) : (
                        "3-20 chars"
                      )}
                    </span>
                  )}
                </div>
              </div>
              <input
                id="discord-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />

              {/* REDDIT-STYLE HANDLE SUGGESTIONS */}
              <div className="discord-suggestions-bar">
                <span className="suggestions-intro">Try:</span>
                <div className="discord-suggestions-list">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      className={`discord-sug-pill ${username === sug ? "active" : ""}`}
                      onClick={() => handlePickSuggestion(sug)}
                    >
                      @{sug}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="discord-roll-btn"
                    onClick={handleRollSuggestions}
                    title="Shuffle new usernames"
                    aria-label="Shuffle new usernames"
                  >
                    <FaRedo style={{ fontSize: "10px" }} />
                  </button>
                </div>
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="discord-field">
              <div className="discord-label-row">
                <label htmlFor="discord-password">
                  PASSWORD <span className="discord-req">*</span>
                </label>
                {password && (
                  <span className="discord-pass-strength" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                )}
              </div>
              <div className="discord-input-with-action">
                <input
                  id="discord-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="discord-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* DATE OF BIRTH - ICONIC DISCORD 3-PART SELECT */}
            <div className="discord-field">
              <label>
                DATE OF BIRTH <span className="discord-req">*</span>
              </label>
              <div className="discord-dob-grid">
                <select
                  value={dobMonth}
                  onChange={(e) => setDobMonth(e.target.value)}
                  className="discord-select"
                  aria-label="Month"
                  required
                >
                  <option value="" disabled>
                    Month
                  </option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={dobDay}
                  onChange={(e) => setDobDay(e.target.value)}
                  className="discord-select"
                  aria-label="Day"
                  required
                >
                  <option value="" disabled>
                    Day
                  </option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value)}
                  className="discord-select"
                  aria-label="Year"
                  required
                >
                  <option value="" disabled>
                    Year
                  </option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CINEMA TASTE ARCHETYPE (COMPACT DISCORD CHIPS) */}
            <div className="discord-field">
              <label>TASTE ARCHETYPE</label>
              <div className="discord-archetype-row">
                {CINEMA_ARCHETYPES.map((arch) => {
                  const isSelected = selectedArchetype.id === arch.id;
                  return (
                    <button
                      key={arch.id}
                      type="button"
                      className={`discord-archetype-chip ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedArchetype(arch)}
                      title={arch.desc}
                    >
                      <span>{arch.icon}</span>
                      <small>{arch.title}</small>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OPT-IN EMAIL CHECKBOX */}
            <div className="discord-checkbox-field">
              <label className="discord-check-label">
                <input
                  type="checkbox"
                  checked={optInEmails}
                  onChange={(e) => setOptInEmails(e.target.checked)}
                />
                <span className="discord-check-text">
                  (Optional) Receive occasional updates, community verdict highlights, and new feature drops.
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="discord-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="discord-btn-spinner">Creating account...</span>
              ) : (
                "Continue"
              )}
            </button>

            {/* TERMS & CONDITIONS NOTICE */}
            <p className="discord-terms-notice">
              By registering, you agree to Vouch's{" "}
              <Link to="/about">Terms of Service</Link> and{" "}
              <Link to="/about">Privacy Policy</Link>.
            </p>

            {/* ALREADY HAVE AN ACCOUNT */}
            <div className="discord-switch-footer">
              <Link to="/login" className="discord-login-link">
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Signup;
