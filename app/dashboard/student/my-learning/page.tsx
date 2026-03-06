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

interface ProgressData {
  courseId: string;
  percentage: number;
  completedLessons: number;
  totalLessons: number;
}

export default function MyLearning() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enroll")
      .then((res) => res.json())
      .then(async (data) => {
        if (Array.isArray(data)) {
          setCourses(data);
          // Fetch progress for each course
          const progressMap: Record<string, ProgressData> = {};
          await Promise.all(
            data.map(async (course: Course) => {
              try {
                const res = await fetch(`/api/courses/status/${course._id}`);
                const p = await res.json();
                if (p.success) {
                  progressMap[course._id] = { courseId: course._id, ...p };
                }
              } catch {}
            })
          );
          setProgress(progressMap);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
        <div style={{ color: "#6b7280" }}>Loading your courses...</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>
          My Learning
        </h1>
        <p style={{ color: "#6b7280" }}>
          {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
        </p>
      </div>

      {courses.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: "12px", padding: "60px",
          textAlign: "center", border: "2px dashed #e5e7eb",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1c1d1f", marginBottom: "8px" }}>
            No enrolled courses
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>
            Browse our catalog and enroll in your first course!
          </p>
          <Link href="/dashboard/student/courses" style={{
            padding: "12px 28px", background: "#a435f0", color: "#fff",
            borderRadius: "8px", textDecoration: "none", fontWeight: "700",
          }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {courses.map((course) => {
            const p = progress[course._id];
            const pct = p?.percentage || 0;

            return (
              <div key={course._id} style={{
                background: "#fff", borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}>
                {/* Course color banner */}
                <div style={{
                  height: "6px",
                  background: pct === 100
                    ? "linear-gradient(90deg,#16a34a,#22c55e)"
                    : "linear-gradient(90deg,#a435f0,#7c3aed)",
                }} />

                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span style={{
                      fontSize: "11px", fontWeight: "700", padding: "3px 8px",
                      background: "#f3f0ff", color: "#7c3aed", borderRadius: "4px",
                    }}>
                      {course.category || "Course"}
                    </span>
                    {pct === 100 && (
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a" }}>✓ Completed</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1c1d1f", marginBottom: "8px", lineHeight: 1.4 }}>
                    {course.title}
                  </h3>

                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px", lineHeight: 1.5 }}>
                    {course.description?.slice(0, 90)}...
                  </p>

                  {/* Progress bar */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>Progress</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: pct === 100 ? "#16a34a" : "#a435f0" }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "999px" }}>
                      <div style={{
                        height: "6px", borderRadius: "999px", width: `${pct}%`,
                        background: pct === 100 ? "#16a34a" : "#a435f0",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    {p && (
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                        {p.completedLessons} / {p.totalLessons} lessons
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/dashboard/student/courses/${course._id}`}
                    style={{
                      display: "block", textAlign: "center", padding: "10px",
                      background: pct === 100 ? "#16a34a" : "#a435f0", color: "#fff",
                      borderRadius: "6px", textDecoration: "none", fontWeight: "700", fontSize: "14px",
                    }}
                  >
                    {pct === 0 ? "Start Learning" : pct === 100 ? "Review Course" : "Continue Learning"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}