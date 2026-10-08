"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim()) return setError("Enter a username.");
    if (!password) return setError("Enter your password.");

    if (isRegistering && password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);

    const endpoint = isRegistering
      ? "/api/auth/register"
      : "/api/auth/login";

    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await r.json().catch(() => null);

    setLoading(false);

    if (!r.ok) {
      setError(data?.error || "Something went wrong.");
      return;
    }

    // Registration successful → automatically log in
    if (isRegistering) {
      const login = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!login.ok) {
        setError("Account created, but automatic login failed.");
        return;
      }
    }

    router.push("/channels");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl bg-[#313338] p-8 shadow-2xl"
    >
      <h2 className="mb-6 text-center text-xl font-bold">
        {isRegistering ? "Create an account" : "Welcome back!"}
      </h2>

      <label className="mb-2 block text-xs font-bold uppercase text-[#b5bac1]">
        Username
      </label>

      <input
        className="input mb-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="alex"
        autoFocus
      />

      <label className="mb-2 block text-xs font-bold uppercase text-[#b5bac1]">
        Password
      </label>

      <input
        className="input mb-4"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />

      {error && (
        <p className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        className="btn w-full bg-[#5865f2]"
        disabled={loading}
      >
        {loading
          ? isRegistering
            ? "Creating account..."
            : "Signing in..."
          : isRegistering
            ? "Create Account"
            : "Continue"}
      </button>

      <div className="mt-5 text-center text-sm text-[#b5bac1]">
        {isRegistering
          ? "Already have an account?"
          : "Need an account?"}

        <button
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError("");
          }}
          className="ml-1 text-[#5865f2] hover:underline"
        >
          {isRegistering ? "Log in" : "Register"}
        </button>
      </div>
    </form>
  );
}