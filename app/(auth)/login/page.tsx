"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f7f9fa",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "36px", height: "36px", background: "#a435f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: "800", fontSize: "18px" }}>E</span>
            </div>
            <span style={{ fontWeight: "800", fontSize: "24px", color: "#1c1d1f" }}>EduFlex</span>
          </div>
        </div>

        <div style={{
          background: "#fff", borderRadius: "12px", padding: "40px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb",
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>
            Welcome back
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "28px", fontSize: "14px" }}>
            Sign in to continue learning
          </p>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px",
              padding: "12px", color: "#dc2626", fontSize: "14px", marginBottom: "20px",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#1c1d1f", marginBottom: "6px" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%", padding: "12px 14px", border: "1px solid #d1d5db",
                  borderRadius: "6px", fontSize: "15px", outline: "none",
                  boxSizing: "border-box", color: "#1c1d1f",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#1c1d1f", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%", padding: "12px 14px", border: "1px solid #d1d5db",
                  borderRadius: "6px", fontSize: "15px", outline: "none",
                  boxSizing: "border-box", color: "#1c1d1f",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px", background: loading ? "#c084fc" : "#a435f0",
                color: "#fff", border: "none", borderRadius: "6px",
                fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6b7280" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "#a435f0", fontWeight: "700", textDecoration: "none" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}