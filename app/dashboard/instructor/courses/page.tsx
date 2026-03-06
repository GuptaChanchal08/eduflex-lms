"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: string;
  enrollments: number;
  createdAt: string;
}

interface Section { _id: string; title: string; }
interface Lesson { _id: string; title: string; contentType: string; }
interface CurriculumItem { section: Section; lessons: Lesson[]; }

export default function InstructorCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [loadingCurr, setLoadingCurr] = useState(false);

  // New section/lesson forms
  const [sectionTitle, setSectionTitle] = useState("");
  const [lessonForm, setLessonForm] = useState({ sectionId: "", title: "", contentType: "video", contentUrl: "", textContent: "" });
  const [publishing, setPublishing] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/courses/my-courses")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCourses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openCourse = async (course: Course) => {
    setSelected(course);
    setMsg("");
    setLoadingCurr(true);
    const res = await fetch(`/api/courses/curriculum/${course._id}`);
    const data = await res.json();
    setCurriculum(data.curriculum || []);
    setLoadingCurr(false);
  };

  const addSection = async () => {
    if (!sectionTitle || !selected) return;
    setSavingSection(true);
    const res = await fetch("/api/courses/sections/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: sectionTitle, courseId: selected._id, order: curriculum.length + 1 }),
    });
    if (res.ok) {
      setSectionTitle("");
      await openCourse(selected);
      setMsg("✓ Section added");
    }
    setSavingSection(false);
  };

  const addLesson = async () => {
    if (!lessonForm.title || !lessonForm.sectionId || !selected) return;
    setSavingLesson(true);
    const res = await fetch("/api/courses/sections/lessons/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lessonForm, courseId: selected._id }),
    });
    if (res.ok) {
      setLessonForm({ sectionId: "", title: "", contentType: "video", contentUrl: "", textContent: "" });
      await openCourse(selected);
      setMsg("✓ Lesson added");
    }
    setSavingLesson(false);
  };

  const togglePublish = async (courseId: string, currentStatus: string) => {
    setPublishing(courseId);
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await fetch("/api/courses/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, status: newStatus }),
    });
    setCourses(prev => prev.map(c => c._id === courseId ? { ...c, status: newStatus } : c));
    if (selected?._id === courseId) setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    setPublishing(null);
  };

  const btnStyle = (bg: string, disabled?: boolean) => ({
    padding: "10px 20px", background: disabled ? "#e5e7eb" : bg, color: disabled ? "#9ca3af" : "#fff",
    border: "none", borderRadius: "6px", cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "700" as const, fontSize: "14px",
  });

  const inputStyle = {
    width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
    borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" as const,
    marginBottom: "10px", color: "#1c1d1f",
  };

  if (loading) return <div style={{ color: "#6b7280", padding: "40px", fontFamily: "Inter, sans-serif" }}>Loading...</div>;

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "24px" }}>My Courses</h1>

      {!selected ? (
        <>
          {courses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", background: "#fff", borderRadius: "12px", border: "2px dashed #e5e7eb" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
              <h3 style={{ fontWeight: "700", color: "#1c1d1f", marginBottom: "8px" }}>No courses yet</h3>
              <p style={{ color: "#6b7280", marginBottom: "20px" }}>Create your first course to get started.</p>
              <Link href="/dashboard/instructor/create" style={{ padding: "12px 24px", background: "#a435f0", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: "700" }}>
                Create Course
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {courses.map(course => (
                <div key={course._id} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ height: "6px", background: course.status === "published" ? "#16a34a" : "#f59e0b" }} />
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{
                        fontSize: "11px", fontWeight: "700", padding: "3px 8px",
                        background: course.status === "published" ? "#dcfce7" : "#fef3c7",
                        color: course.status === "published" ? "#16a34a" : "#d97706",
                        borderRadius: "4px",
                      }}>
                        {course.status === "published" ? "Published" : "Draft"}
                      </span>
                      <span style={{ fontSize: "13px", color: "#6b7280" }}>
                        👥 {course.enrollments || 0} students
                      </span>
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1c1d1f", marginBottom: "6px" }}>{course.title}</h3>
                    <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>{course.category}</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => openCourse(course)} style={{ ...btnStyle("#a435f0"), flex: 1 }}>
                        Manage
                      </button>
                      <button
                        onClick={() => togglePublish(course._id, course.status)}
                        disabled={publishing === course._id}
                        style={{ ...btnStyle(course.status === "published" ? "#6b7280" : "#16a34a") }}
                      >
                        {course.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Course detail / curriculum builder
        <div>
          <button onClick={() => { setSelected(null); setMsg(""); }} style={{ ...btnStyle("#6b7280"), marginBottom: "20px" }}>
            ← Back to Courses
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1c1d1f" }}>{selected.title}</h2>
              <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                <span style={{
                  fontSize: "12px", fontWeight: "700", padding: "3px 8px",
                  background: selected.status === "published" ? "#dcfce7" : "#fef3c7",
                  color: selected.status === "published" ? "#16a34a" : "#d97706",
                  borderRadius: "4px",
                }}>
                  {selected.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
            </div>
            <button
              onClick={() => togglePublish(selected._id, selected.status)}
              disabled={publishing === selected._id}
              style={btnStyle(selected.status === "published" ? "#6b7280" : "#16a34a")}
            >
              {selected.status === "published" ? "Unpublish Course" : "Publish Course"}
            </button>
          </div>

          {msg && <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 14px", borderRadius: "6px", marginBottom: "20px", fontWeight: "600", fontSize: "14px" }}>{msg}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Curriculum */}
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1c1d1f", marginBottom: "16px" }}>Course Curriculum</h3>
              {loadingCurr ? (
                <p style={{ color: "#6b7280" }}>Loading curriculum...</p>
              ) : curriculum.length === 0 ? (
                <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "24px", textAlign: "center", border: "2px dashed #e5e7eb" }}>
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>No sections yet. Add your first section →</p>
                </div>
              ) : (
                curriculum.map((item) => (
                  <div key={item.section._id} style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb", marginBottom: "12px", overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", color: "#1c1d1f", fontSize: "15px" }}>📂 {item.section.title}</span>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>{item.lessons.length} lessons</span>
                    </div>
                    {item.lessons.map((lesson, idx) => (
                      <div key={lesson._id} style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: "#9ca3af", fontSize: "12px" }}>{idx + 1}.</span>
                        <span style={{ fontSize: "14px", color: "#374151", flex: 1 }}>{lesson.title}</span>
                        <span style={{ fontSize: "11px", padding: "2px 6px", background: lesson.contentType === "video" ? "#ede9fe" : "#dbeafe", color: lesson.contentType === "video" ? "#7c3aed" : "#1d4ed8", borderRadius: "4px", fontWeight: "600" }}>
                          {lesson.contentType}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Add section & lesson */}
            <div>
              {/* Add section */}
              <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb", padding: "20px", marginBottom: "20px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#1c1d1f", marginBottom: "14px" }}>➕ Add Section</h4>
                <input
                  placeholder="Section title (e.g. Introduction)"
                  value={sectionTitle}
                  onChange={e => setSectionTitle(e.target.value)}
                  style={inputStyle}
                />
                <button onClick={addSection} disabled={savingSection || !sectionTitle} style={btnStyle("#a435f0", !sectionTitle)}>
                  {savingSection ? "Adding..." : "Add Section"}
                </button>
              </div>

              {/* Add lesson */}
              <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb", padding: "20px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#1c1d1f", marginBottom: "14px" }}>🎬 Add Lesson</h4>

                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>Section</label>
                <select
                  value={lessonForm.sectionId}
                  onChange={e => setLessonForm({ ...lessonForm, sectionId: e.target.value })}
                  style={{ ...inputStyle }}
                >
                  <option value="">Select a section</option>
                  {curriculum.map(item => (
                    <option key={item.section._id} value={item.section._id}>{item.section.title}</option>
                  ))}
                </select>

                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>Lesson Title</label>
                <input
                  placeholder="e.g. What is React?"
                  value={lessonForm.title}
                  onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                  style={inputStyle}
                />

                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>Content Type</label>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  {["video", "text"].map(type => (
                    <button
                      key={type}
                      onClick={() => setLessonForm({ ...lessonForm, contentType: type })}
                      style={{
                        padding: "8px 16px", border: `2px solid ${lessonForm.contentType === type ? "#a435f0" : "#e5e7eb"}`,
                        borderRadius: "6px", background: lessonForm.contentType === type ? "#faf5ff" : "#fff",
                        color: lessonForm.contentType === type ? "#a435f0" : "#6b7280",
                        cursor: "pointer", fontWeight: "600", fontSize: "13px",
                      }}
                    >
                      {type === "video" ? "▶ Video URL" : "📝 Text"}
                    </button>
                  ))}
                </div>

                {lessonForm.contentType === "video" && (
                  <>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>Video URL (YouTube or direct)</label>
                    <input
                      placeholder="https://youtube.com/watch?v=..."
                      value={lessonForm.contentUrl}
                      onChange={e => setLessonForm({ ...lessonForm, contentUrl: e.target.value })}
                      style={inputStyle}
                    />
                  </>
                )}

                {lessonForm.contentType === "text" && (
                  <>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>Lesson Content</label>
                    <textarea
                      placeholder="Write your lesson content here..."
                      value={lessonForm.textContent}
                      onChange={e => setLessonForm({ ...lessonForm, textContent: e.target.value })}
                      style={{ ...inputStyle, minHeight: "120px", resize: "vertical" as const }}
                    />
                  </>
                )}

                <button
                  onClick={addLesson}
                  disabled={savingLesson || !lessonForm.title || !lessonForm.sectionId}
                  style={btnStyle("#a435f0", !lessonForm.title || !lessonForm.sectionId)}
                >
                  {savingLesson ? "Adding..." : "Add Lesson"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}