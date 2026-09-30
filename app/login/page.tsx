"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@nexus.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    if (email === "admin@nexus.com" && password === "admin123") {
      localStorage.setItem(
        "nexus-user",
        JSON.stringify({
          email,
          role: "admin",
        })
      );

      window.location.href = "/";
      return;
    }

    if (email === "viewer@nexus.com" && password === "viewer123") {
      localStorage.setItem(
        "nexus-user",
        JSON.stringify({
          email,
          role: "viewer",
        })
      );

      window.location.href = "/";
      return;
    }

    setError("Invalid email or password");
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Nexus Admin</h1>
          <p className="text-gray-400 mt-2">
            Sign in to access the management portal
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-400">
              Email
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-lg font-medium"
          >
            Sign In
          </button>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-5 text-sm text-gray-500">
          <p>Admin: admin@nexus.com / admin123</p>
          <p className="mt-1">Viewer: viewer@nexus.com / viewer123</p>
        </div>
      </div>
    </main>
  );
}