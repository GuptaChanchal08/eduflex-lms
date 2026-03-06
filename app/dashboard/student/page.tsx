import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/db";
import Link from "next/link";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/login");

  const client = await clientPromise;
  const db = client.db("eduflex_lms");

  const enrollments = await db
    .collection("enrollments")
    .find({ studentId: session.user.id })
    .toArray();

  const totalCourses = enrollments.length;

  // Get progress for each enrolled course
  const progressDocs = await db
    .collection("progress")
    .find({ studentId: session.user.id })
    .toArray();

  const completedCourses = progressDocs.filter(p => {
    const enrollment = enrollments.find(e => e.courseId === p.courseId);
    return enrollment && p.completedLessons?.length > 0;
  }).length;

  const firstName = (session.user as any).name?.split(" ")[0] || "Learner";

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Welcome */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>
          Welcome back, {firstName}! 👋
        </h1>
        <p style={{ color: "#6b7280", fontSize: "15px" }}>
          Pick up where you left off and keep building your skills.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {[
          { label: "Enrolled Courses", value: totalCourses, icon: "📚", color: "#a435f0" },
          { label: "In Progress", value: totalCourses - completedCourses, icon: "⚡", color: "#2563eb" },
          { label: "Completed", value: completedCourses, icon: "🏆", color: "#16a34a" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "#fff", borderRadius: "12px", padding: "24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{stat.icon}</div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: stat.color, marginBottom: "4px" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1c1d1f", marginBottom: "16px" }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <Link href="/dashboard/student/courses" style={{
            padding: "12px 24px", background: "#a435f0", color: "#fff", borderRadius: "8px",
            textDecoration: "none", fontWeight: "700", fontSize: "14px",
          }}>
            🔍 Browse Courses
          </Link>
          <Link href="/dashboard/student/my-learning" style={{
            padding: "12px 24px", background: "#fff", border: "2px solid #a435f0",
            color: "#a435f0", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "14px",
          }}>
            📖 My Learning
          </Link>
          <Link href="/dashboard/student/progress" style={{
            padding: "12px 24px", background: "#fff", border: "2px solid #e5e7eb",
            color: "#1c1d1f", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "14px",
          }}>
            📊 View Progress
          </Link>
        </div>
      </div>

      {/* Empty state */}
      {totalCourses === 0 && (
        <div style={{
          background: "#fff", borderRadius: "12px", padding: "48px",
          textAlign: "center", border: "2px dashed #e5e7eb",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎓</div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1c1d1f", marginBottom: "8px" }}>
            No courses yet
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>
            Browse our catalog and enroll in your first course!
          </p>
          <Link href="/dashboard/student/courses" style={{
            padding: "12px 28px", background: "#a435f0", color: "#fff",
            borderRadius: "8px", textDecoration: "none", fontWeight: "700",
          }}>
            Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
}