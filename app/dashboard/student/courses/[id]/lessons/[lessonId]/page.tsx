"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Lesson {
  _id: string;
  title: string;
  contentType: "video" | "text";
  contentUrl?: string;
  textContent?: string;
  sectionId: string;
  courseId: string;
}

interface Section {
  _id: string;
  title: string;
}

interface CurriculumItem {
  section: Section;
  lessons: Lesson[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [currRes, progressRes] = await Promise.all([
        fetch(`/api/courses/curriculum/${courseId}`),
        fetch(`/api/courses/status/${courseId}`),
      ]);

      const currData = await currRes.json();
      if (currData.curriculum) {
        setCurriculum(currData.curriculum);
        // Find current lesson
        for (const item of currData.curriculum) {
          const found = item.lessons.find((l: Lesson) => l._id === lessonId);
          if (found) { setLesson(found); break; }
        }
      }

      const progressData = await progressRes.json();
      // We don't have per-lesson completion status here; just show mark button
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [courseId, lessonId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const markComplete = async () => {
    setMarking(true);
    await fetch("/api/courses/progress/mark-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, lessonId }),
    });
    setCompleted(true);
    setMarking(false);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px", fontFamily: "Inter, sans-serif" }}>
      <p style={{ color: "#6b7280" }}>Loading lesson...</p>
    </div>
  );

  const allLessons = curriculum.flatMap(c => c.lessons);
  const currentIdx = allLessons.findIndex(l => l._id === lessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", fontFamily: "Inter, sans-serif", background: "#f8fafc" }}>
      {/* Sidebar curriculum */}
      <div style={{
        width: "300px", minWidth: "300px", background: "#1c1d1f", color: "#fff",
        padding: "24px 0", overflowY: "auto", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "0 20px 16px", borderBottom: "1px solid #374151" }}>
          <Link href={`/dashboard/student/courses/${courseId}`} style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>
            ← Back to Course
          </Link>
          <h3 style={{ fontSize: "15px", fontWeight: "700", marginTop: "8px", color: "#fff" }}>
            Course Content
          </h3>
        </div>

        {curriculum.map((item) => (
          <div key={item.section._id}>
            <div style={{ padding: "12px 20px", background: "#111827", fontSize: "13px", fontWeight: "700", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
              {item.section.title}
            </div>
            {item.lessons.map((l, idx) => (
              <Link
                key={l._id}
                href={`/dashboard/student/courses/${courseId}/lessons/${l._id}`}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 20px", textDecoration: "none",
                  background: l._id === lessonId ? "#374151" : "transparent",
                  borderLeft: l._id === lessonId ? "3px solid #a435f0" : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: "12px", color: "#6b7280", minWidth: "20px" }}>{idx + 1}</span>
                <span style={{ fontSize: "14px", color: l._id === lessonId ? "#fff" : "#d1d5db", lineHeight: 1.4 }}>
                  {l.title}
                </span>
                {l.contentType === "video" && <span style={{ fontSize: "10px", color: "#6b7280", marginLeft: "auto" }}>▶</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {!lesson ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "#6b7280" }}>Lesson not found.</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1c1d1f", marginBottom: "24px" }}>
              {lesson.title}
            </h1>

            {/* Video content */}
            {lesson.contentType === "video" && lesson.contentUrl && (
              <div style={{ marginBottom: "24px" }}>
                {lesson.contentUrl.includes("youtube.com") || lesson.contentUrl.includes("youtu.be") ? (
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden" }}>
                    <iframe
                      src={lesson.contentUrl.replace("watch?v=", "embed/")}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    controls
                    src={lesson.contentUrl}
                    style={{ width: "100%", borderRadius: "12px", background: "#000" }}
                  />
                )}
              </div>
            )}

            {/* Text content */}
            {lesson.textContent && (
              <div style={{
                background: "#fff", borderRadius: "12px", padding: "28px",
                border: "1px solid #e5e7eb", marginBottom: "24px",
                lineHeight: 1.8, color: "#374151", fontSize: "15px",
              }}>
                <div style={{ whiteSpace: "pre-wrap" }}>{lesson.textContent}</div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                {prevLesson && (
                  <Link href={`/dashboard/student/courses/${courseId}/lessons/${prevLesson._id}`} style={{
                    padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "6px",
                    textDecoration: "none", color: "#374151", fontWeight: "600", fontSize: "14px",
                  }}>
                    ← Previous
                  </Link>
                )}
                {nextLesson && (
                  <Link href={`/dashboard/student/courses/${courseId}/lessons/${nextLesson._id}`} style={{
                    padding: "10px 20px", background: "#a435f0", borderRadius: "6px",
                    textDecoration: "none", color: "#fff", fontWeight: "600", fontSize: "14px",
                  }}>
                    Next →
                  </Link>
                )}
              </div>

              <button
                onClick={markComplete}
                disabled={completed || marking}
                style={{
                  padding: "10px 24px",
                  background: completed ? "#16a34a" : "#1c1d1f",
                  color: "#fff", border: "none", borderRadius: "6px",
                  cursor: completed ? "default" : "pointer",
                  fontWeight: "700", fontSize: "14px",
                }}
              >
                {completed ? "✓ Marked Complete" : marking ? "Marking..." : "Mark as Complete"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}