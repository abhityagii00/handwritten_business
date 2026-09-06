"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Invalid username or password");
        return;
      }


      window.location.href = "/admin";
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-black">
            Write<span className="text-blue-600">Cicle</span>
          </a>

          <p className="mt-3 text-sm text-black/50">
            Admin Dashboard Login
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm"
        >
          <h1 className="text-2xl font-black">
            Welcome back 👋
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Login to manage WriteCircle orders.
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-bold">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-black px-6 py-4 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

          <a
            href="/"
            className="mt-5 block text-center text-sm font-semibold text-black/50 hover:text-blue-600"
          >
            ← Back to Website
          </a>
        </form>

      </div>
    </main>
  );
}