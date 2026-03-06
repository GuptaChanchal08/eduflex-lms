"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Web Development", "Mobile Development", "Data Science", "Machine Learning",
  "UI/UX Design", "Cyber Security", "Digital Marketing", "Business",
  "Programming", "Blockchain", "Cloud Computing", "DevOps", "Other",
];

export default function CreateCourse() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/courses/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/dashboard/instructor/courses");
    } else {
      setError(data.error || "Error creating course. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", border: "1px solid #d1d5db",
    borderRadius: "6px", fontSize: "15px", outline: "none",
    boxSizing: "border-box" as const, marginBottom: "16px", color: "#1c1d1f",
  };

  const labelStyle = {
    display: "block" as const, fontSize: "14px", fontWeight: "600" as const,
    color: "#1c1d1f", marginBottom: "6px",
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>
          Create New Course
        </h1>
        <p style={{ color: "#6b7280" }}>Fill in the details to create your course. You can add sections and lessons after.</p>
      </div>

      <div style={{ maxWidth: "640px" }}>
        <div style={{
          background: "#fff", borderRadius: "12px", padding: "36px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb",
        }}>
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px",
              padding: "12px", color: "#dc2626", fontSize: "14px", marginBottom: "20px",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Course Title *</label>
            <input
              placeholder="e.g. Complete React Developer Bootcamp"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>Description *</label>
            <textarea
              placeholder="What will students learn? What are the prerequisites?"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
              style={{ ...inputStyle, minHeight: "120px", resize: "vertical" as const }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  required
                  style={{ ...inputStyle, marginBottom: 0 }}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Price (₹)</label>
                <input
                  type="number"
                  placeholder="0 for free"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  min="0"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
              </div>
            </div>

            <div style={{ marginTop: "24px", padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
                💡 <strong>Next steps after creating:</strong> Go to "My Courses", open your course, add sections, then add video or text lessons to each section. Finally, publish when ready.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", background: loading ? "#c084fc" : "#a435f0",
                color: "#fff", border: "none", borderRadius: "6px",
                fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating Course..." : "Create Course →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}