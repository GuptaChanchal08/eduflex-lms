import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/login");
  if ((session.user as any).role !== "admin") redirect("/unauthorized");

  const client = await clientPromise;
  const db = client.db("eduflex_lms");

  const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("courses").countDocuments(),
    db.collection("enrollments").countDocuments(),
  ]);

  const publishedCourses = await db.collection("courses").countDocuments({ status: "published" });

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "#6b7280" }}>Platform overview and management</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {[
          { label: "Total Users", value: totalUsers, icon: "👥", color: "#2563eb" },
          { label: "Total Courses", value: totalCourses, icon: "📚", color: "#a435f0" },
          { label: "Published", value: publishedCourses, icon: "✅", color: "#16a34a" },
          { label: "Enrollments", value: totalEnrollments, icon: "🎓", color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "#fff", borderRadius: "12px", padding: "24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{stat.icon}</div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { href: "/dashboard/admin/users", title: "Manage Users", icon: "👥", desc: "View all users, activate or deactivate accounts" },
          { href: "/dashboard/admin/courses", title: "Manage Courses", icon: "📚", desc: "View all courses, publish or delete them" },
        ].map(card => (
          <Link key={card.href} href={card.href} style={{
            display: "block", padding: "24px", background: "#fff", borderRadius: "12px",
            border: "1px solid #e5e7eb", textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>{card.icon}</div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1c1d1f", marginBottom: "4px" }}>{card.title}</h3>
            <p style={{ fontSize: "13px", color: "#6b7280" }}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}