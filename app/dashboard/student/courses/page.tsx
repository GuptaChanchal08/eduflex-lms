"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
}

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/courses/list").then(r => r.json()),
      fetch("/api/enroll").then(r => r.json()),
    ]).then(([allCourses, enrolled]) => {
      if (Array.isArray(allCourses)) setCourses(allCourses);
      if (Array.isArray(enrolled)) {
        setEnrolledIds(new Set(enrolled.map((c: Course) => c._id)));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === "All" || c.category === selectedCat;
    return matchSearch && matchCat;
  });

  const enroll = async (courseId: string) => {
    setLoadingId(courseId);
    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json();
    if (res.ok) {
      setEnrolledIds(prev => new Set([...prev, courseId]));
      setFeedback(prev => ({ ...prev, [courseId]: "✓ Enrolled!" }));
    } else {
      setFeedback(prev => ({ ...prev, [courseId]: data.error || data.message || "Failed" }));
    }
    setLoadingId(null);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "16px" }}>
          Browse Courses
        </h1>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
          <input
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px 12px 42px", border: "1px solid #d1d5db",
              borderRadius: "8px", fontSize: "15px", outline: "none", background: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: "6px 16px", borderRadius: "999px", border: "none",
                background: selectedCat === cat ? "#a435f0" : "#f1f5f9",
                color: selectedCat === cat ? "#fff" : "#374151",
                cursor: "pointer", fontWeight: "600", fontSize: "13px",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#6b7280", padding: "60px" }}>Loading courses...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: "#6b7280", padding: "60px" }}>
          No courses found. Try a different search.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {filtered.map((course) => {
            const isEnrolled = enrolledIds.has(course._id);
            return (
              <div key={course._id} style={{
                background: "#fff", borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  height: "140px",
                  background: `linear-gradient(135deg, #7c3aed, #a435f0)`,
                  borderRadius: "12px 12px 0 0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "40px",
                }}>
                  📘
                </div>

                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{
                      fontSize: "11px", fontWeight: "700", padding: "3px 8px",
                      background: "#f3f0ff", color: "#7c3aed", borderRadius: "4px",
                    }}>
                      {course.category || "General"}
                    </span>
                  </div>

                  <Link href={`/dashboard/student/courses/${course._id}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1c1d1f", marginBottom: "8px", lineHeight: 1.4, cursor: "pointer" }}>
                      {course.title}
                    </h3>
                  </Link>

                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px", lineHeight: 1.5, flex: 1 }}>
                    {course.description?.slice(0, 90)}{course.description?.length > 90 ? "..." : ""}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "800", color: "#1c1d1f" }}>
                      {course.price === 0 ? "Free" : `₹${course.price.toLocaleString()}`}
                    </span>
                  </div>

                  {feedback[course._id] && (
                    <div style={{ fontSize: "13px", color: "#16a34a", marginBottom: "8px", fontWeight: "600" }}>
                      {feedback[course._id]}
                    </div>
                  )}

                  {isEnrolled ? (
                    <Link
                      href={`/dashboard/student/courses/${course._id}`}
                      style={{
                        display: "block", textAlign: "center", padding: "10px",
                        background: "#16a34a", color: "#fff",
                        borderRadius: "6px", textDecoration: "none", fontWeight: "700", fontSize: "14px",
                      }}
                    >
                      Continue Learning →
                    </Link>
                  ) : (
                    <button
                      onClick={() => enroll(course._id)}
                      disabled={loadingId === course._id}
                      style={{
                        width: "100%", padding: "10px", background: loadingId === course._id ? "#c084fc" : "#a435f0",
                        color: "#fff", border: "none", borderRadius: "6px",
                        cursor: loadingId === course._id ? "not-allowed" : "pointer",
                        fontWeight: "700", fontSize: "14px",
                      }}
                    >
                      {loadingId === course._id ? "Enrolling..." : "Enroll Now"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}