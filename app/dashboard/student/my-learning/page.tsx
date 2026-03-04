"use client";

import { useEffect, useState } from "react";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
}

export default function MyLearning() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("/api/enroll/my-courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>My Learning</h1>

      {courses.length === 0 && <p>You have not enrolled in any course.</p>}

      <div style={{ display: "grid", gap: "20px" }}>
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
            <h2>{course.title}</h2>
            <p style={{ color: "#475569" }}>{course.description}</p>
            <p><strong>₹ {course.price}</strong></p>
            <p style={{ fontSize: "14px", color: "#64748b" }}>
              Category: {course.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}