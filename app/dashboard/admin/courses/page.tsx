"use client";

import { useEffect, useState } from "react";

interface Instructor { firstName: string; lastName: string; email: string; }
interface Course {
  _id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  enrollments: number;
  instructor: Instructor | null;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [publishing, setPublishing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const togglePublish = async (courseId: string, current: string) => {
    setPublishing(courseId);
    const newStatus = current === "published" ? "draft" : "published";
    await fetch("/api/courses/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, status: newStatus }),
    });
    setCourses(prev => prev.map(c => c._id === courseId ? { ...c, status: newStatus } : c));
    setPublishing(null);
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This cannot be undone.")) return;
    setDeleting(courseId);
    await fetch("/api/admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    setCourses(prev => prev.filter(c => c._id !== courseId));
    setDeleting(null);
  };

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>Manage Courses</h1>
        <p style={{ color: "#6b7280" }}>{courses.length} total courses</p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input
          placeholder="Search courses or instructor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "200px", padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none" }}
        />
        {["all", "published", "draft"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: "8px 16px", borderRadius: "999px", border: "none",
            background: statusFilter === s ? "#a435f0" : "#f1f5f9",
            color: statusFilter === s ? "#fff" : "#374151",
            cursor: "pointer", fontWeight: "600", fontSize: "13px", textTransform: "capitalize" as const,
          }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>Loading...</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 80px 80px 80px 180px",
            padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb",
            fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase" as const,
          }}>
            <span>Course</span><span>Instructor</span><span>Price</span><span>Students</span><span>Status</span><span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>No courses found.</div>
          ) : (
            filtered.map(course => (
              <div key={course._id} style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 80px 80px 80px 180px",
                padding: "14px 20px", borderBottom: "1px solid #f1f5f9", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontWeight: "600", color: "#1c1d1f", fontSize: "14px", marginBottom: "2px" }}>{course.title}</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>{course.category}</div>
                </div>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>
                  {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "—"}
                </span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1c1d1f" }}>
                  {course.price === 0 ? "Free" : `₹${course.price}`}
                </span>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#374151" }}>{course.enrollments}</span>
                <span style={{
                  fontSize: "11px", fontWeight: "700", padding: "3px 8px",
                  background: course.status === "published" ? "#dcfce7" : "#fef3c7",
                  color: course.status === "published" ? "#16a34a" : "#d97706",
                  borderRadius: "4px", width: "fit-content",
                }}>
                  {course.status}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => togglePublish(course._id, course.status)}
                    disabled={publishing === course._id}
                    style={{
                      padding: "6px 10px", fontSize: "12px", fontWeight: "700", border: "none",
                      borderRadius: "5px", cursor: "pointer",
                      background: course.status === "published" ? "#fef3c7" : "#dcfce7",
                      color: course.status === "published" ? "#d97706" : "#16a34a",
                    }}
                  >
                    {publishing === course._id ? "..." : course.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    disabled={deleting === course._id}
                    style={{
                      padding: "6px 10px", fontSize: "12px", fontWeight: "700",
                      background: "#fee2e2", color: "#dc2626", border: "none",
                      borderRadius: "5px", cursor: "pointer",
                    }}
                  >
                    {deleting === course._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}