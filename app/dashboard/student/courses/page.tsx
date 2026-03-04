"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
}

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses/list");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses");
      }
    };

    fetchCourses();
  }, []);

  const enroll = async (courseId: string) => {
    try {
      setLoadingCourseId(courseId);

      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      alert(data.message || data.error);
    } catch (error) {
      alert("Enrollment failed");
    } finally {
      setLoadingCourseId(null);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>Available Courses</h1>

      <div style={{ display: "grid", gap: "20px" }}>
        {courses.length === 0 && <p>No courses available.</p>}

        {courses.map((course) => (
          <div
            key={course._id}
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* Course Title Link */}
            <Link
              href={`/dashboard/student/courses/${course._id}`}
              style={{
                textDecoration: "none",
                color: "#111827",
              }}
            >
              <h2 style={{ marginBottom: "8px" }}>{course.title}</h2>
            </Link>

            <p style={{ marginBottom: "10px", color: "#475569" }}>
              {course.description}
            </p>

            <p style={{ fontWeight: "bold" }}>₹ {course.price}</p>

            <p style={{ fontSize: "14px", color: "#64748b" }}>
              Category: {course.category}
            </p>

            <button
              onClick={() => enroll(course._id)}
              disabled={loadingCourseId === course._id}
              style={{
                marginTop: "12px",
                padding: "8px 14px",
                background: "#16a34a",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {loadingCourseId === course._id
                ? "Enrolling..."
                : "Enroll"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}