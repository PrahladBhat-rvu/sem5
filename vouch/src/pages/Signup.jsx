import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError(
        "Username can only contain letters, numbers and underscores."
      );
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
          display_name: displayName.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      navigate("/");
      return;
    }

    setSuccess(
      "Account created. Check your email to verify your account."
    );
  };

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-main">
        <div className="auth-card">

          {/* <div className="auth-brand">VOUCH</div> */}

          <div className="auth-heading">
            <h1>Create an account</h1>
            <p>Join Vouch and start sharing what you think.</p>
          </div>

          <form className="auth-form" onSubmit={handleSignup}>

            {error && (
              <div className="auth-message auth-message-error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-message auth-message-success">
                {success}
              </div>
            )}

            <div className="auth-row">
              <div className="auth-field">
                <label htmlFor="username">Username</label>

                <input
                  id="username"
                  type="text"
                  placeholder="yourusername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />

                <small>Letters, numbers and underscores only.</small>
              </div>

              <div className="auth-field">
                <label htmlFor="displayName">
                  Display name <span>(optional)</span>
                </label>

                <input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-row">
              <div className="auth-field">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Enter password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <p className="auth-legal">
              By creating an account, you agree to our{" "}
              <a href="#">Privacy Policy</a> and{" "}
              <a href="#">Terms & Conditions</a>.
            </p>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Log in →</Link>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Signup;