"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/login?registered=true");
    } else {
      setError(data.error || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", border: "1px solid #d1d5db",
    borderRadius: "6px", fontSize: "15px", outline: "none",
    boxSizing: "border-box" as const, color: "#1c1d1f",
  };

  const labelStyle = {
    display: "block" as const, fontSize: "14px", fontWeight: "600" as const,
    color: "#1c1d1f", marginBottom: "6px",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f7f9fa",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif", padding: "20px",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ width: "36px", height: "36px", background: "#a435f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: "800", fontSize: "18px" }}>E</span>
            </div>
            <span style={{ fontWeight: "800", fontSize: "24px", color: "#1c1d1f" }}>EduFlex</span>
          </Link>
        </div>

        <div style={{
          background: "#fff", borderRadius: "12px", padding: "40px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb",
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>
            Create your account
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "28px", fontSize: "14px" }}>
            Join thousands of learners on EduFlex
          </p>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px",
              padding: "12px", color: "#dc2626", fontSize: "14px", marginBottom: "20px",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  placeholder="John"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>I want to</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { value: "student", label: "🎓 Learn", desc: "Take courses" },
                  { value: "instructor", label: "📚 Teach", desc: "Create courses" },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setForm({ ...form, role: opt.value })}
                    style={{
                      padding: "14px", border: `2px solid ${form.role === opt.value ? "#a435f0" : "#e5e7eb"}`,
                      borderRadius: "8px", cursor: "pointer", textAlign: "center",
                      background: form.role === opt.value ? "#faf5ff" : "#fff",
                    }}
                  >
                    <div style={{ fontSize: "20px", marginBottom: "4px" }}>{opt.label}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6b7280" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#a435f0", fontWeight: "700", textDecoration: "none" }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}