"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Course { _id: string; title: string; category: string; }
interface ProgressItem { courseId: string; percentage: number; completedLessons: number; totalLessons: number; }

export default function StudentProgress() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enroll")
      .then(r => r.json())
      .then(async (data) => {
        if (!Array.isArray(data)) { setLoading(false); return; }
        setCourses(data);
        const map: Record<string, ProgressItem> = {};
        await Promise.all(data.map(async (c: Course) => {
          try {
            const res = await fetch(`/api/courses/status/${c._id}`);
            const p = await res.json();
            if (p.success) map[c._id] = { courseId: c._id, ...p };
          } catch {}
        }));
        setProgress(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const overall = courses.length === 0 ? 0 :
    Math.round(Object.values(progress).reduce((sum, p) => sum + p.percentage, 0) / courses.length);

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>My Progress</h1>
        <p style={{ color: "#6b7280" }}>Track your learning across all courses</p>
      </div>

      {/* Overall */}
      {courses.length > 0 && (
        <div style={{ background: "linear-gradient(135deg, #1c1d1f, #3b1f6e)", borderRadius: "12px", padding: "28px", marginBottom: "32px", color: "#fff" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "rgba(255,255,255,0.8)" }}>Overall Progress</h2>
          <div style={{ fontSize: "48px", fontWeight: "800", marginBottom: "12px" }}>{overall}%</div>
          <div style={{ height: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "999px" }}>
            <div style={{ height: "8px", background: "#a435f0", borderRadius: "999px", width: `${overall}%`, transition: "width 1s ease" }} />
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>Loading...</div>
      ) : courses.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "12px", padding: "60px", textAlign: "center", border: "2px dashed #e5e7eb" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
          <h3 style={{ fontWeight: "700", color: "#1c1d1f", marginBottom: "8px" }}>No data yet</h3>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>Enroll in courses to track your progress.</p>
          <Link href="/dashboard/student/courses" style={{ padding: "12px 24px", background: "#a435f0", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: "700" }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {courses.map(course => {
            const p = progress[course._id];
            const pct = p?.percentage || 0;
            return (
              <div key={course._id} style={{ background: "#fff", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "20px" }}>
                {/* Circle progress */}
                <div style={{ position: "relative", width: "60px", height: "60px", flexShrink: 0 }}>
                  <svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle cx="30" cy="30" r="24" fill="none" stroke={pct === 100 ? "#16a34a" : "#a435f0"} strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 24}`}
                      strokeDashoffset={`${2 * Math.PI * 24 * (1 - pct / 100)}`}
                      style={{ transition: "stroke-dashoffset 1s ease" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#1c1d1f" }}>
                    {pct}%
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1c1d1f", marginBottom: "4px" }}>{course.title}</h3>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                    {p ? `${p.completedLessons} of ${p.totalLessons} lessons completed` : "No lessons started"}
                  </p>
                  <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "999px" }}>
                    <div style={{ height: "6px", background: pct === 100 ? "#16a34a" : "#a435f0", borderRadius: "999px", width: `${pct}%` }} />
                  </div>
                </div>

                <Link href={`/dashboard/student/courses/${course._id}`} style={{
                  padding: "8px 16px", background: "#a435f0", color: "#fff",
                  borderRadius: "6px", textDecoration: "none", fontWeight: "700", fontSize: "13px", flexShrink: 0,
                }}>
                  Continue
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}