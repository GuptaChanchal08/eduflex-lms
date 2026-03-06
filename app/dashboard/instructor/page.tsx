import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InstructorDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/login");

  const firstName = (session.user as any).name?.split(" ")[0] || "Instructor";

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>
          Welcome, {firstName}! 👋
        </h1>
        <p style={{ color: "#6b7280", fontSize: "15px" }}>
          Manage your courses and help students learn.
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {[
          {
            icon: "➕",
            title: "Create New Course",
            desc: "Start building a new course from scratch.",
            href: "/dashboard/instructor/create",
            bg: "#a435f0", color: "#fff",
          },
          {
            icon: "📚",
            title: "My Courses",
            desc: "View and manage all your published and draft courses.",
            href: "/dashboard/instructor/courses",
            bg: "#fff", color: "#1c1d1f",
          },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            style={{
              display: "block", padding: "28px", background: card.bg,
              borderRadius: "12px", textDecoration: "none",
              border: card.bg === "#fff" ? "1px solid #e5e7eb" : "none",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>{card.icon}</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: card.color, marginBottom: "6px" }}>
              {card.title}
            </h3>
            <p style={{ color: card.color === "#fff" ? "rgba(255,255,255,0.8)" : "#6b7280", fontSize: "14px" }}>
              {card.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Tips */}
      <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1c1d1f", marginBottom: "16px" }}>
          💡 Instructor Tips
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            "Create your course → add sections → add lessons with video URLs or text content",
            "Publish your course so students can browse and enroll",
            "Add YouTube video URLs for easy video lesson embedding",
            "Structure your course with clear sections for better student experience",
          ].map((tip, i) => (
            <li key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", color: "#374151", fontSize: "14px" }}>
              <span style={{ color: "#a435f0", fontWeight: "700" }}>{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}