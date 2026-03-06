"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", background: "#fff" }}>
      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: "64px", borderBottom: "1px solid #e5e7eb",
        position: "sticky", top: 0, background: "#fff", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", background: "#a435f0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: "800", fontSize: "16px" }}>E</span>
          </div>
          <span style={{ fontWeight: "800", fontSize: "20px", color: "#1c1d1f" }}>EduFlex</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/login" style={{ padding: "10px 20px", border: "1px solid #1c1d1f", borderRadius: "4px", color: "#1c1d1f", textDecoration: "none", fontWeight: "700", fontSize: "15px" }}>
            Log in
          </Link>
          <Link href="/register" style={{ padding: "10px 20px", background: "#1c1d1f", borderRadius: "4px", color: "#fff", textDecoration: "none", fontWeight: "700", fontSize: "15px" }}>
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #1c1d1f 0%, #3b1f6e 60%, #a435f0 100%)",
        color: "#fff", padding: "80px 40px", textAlign: "center",
      }}>
        <h1 style={{ fontSize: "52px", fontWeight: "800", marginBottom: "20px", lineHeight: 1.15 }}>
          Learn Without Limits
        </h1>
        <p style={{ fontSize: "20px", color: "#d1d5db", maxWidth: "560px", margin: "0 auto 36px" }}>
          Join thousands of students learning from expert instructors. Build real skills, earn certificates, and advance your career.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{
            padding: "16px 36px", background: "#a435f0", borderRadius: "6px",
            color: "#fff", textDecoration: "none", fontWeight: "700", fontSize: "18px",
          }}>
            Start Learning Free
          </Link>
          <Link href="/login" style={{
            padding: "16px 36px", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.4)",
            borderRadius: "6px", color: "#fff", textDecoration: "none", fontWeight: "700", fontSize: "18px",
          }}>
            Browse Courses
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#f7f9fa", padding: "40px", display: "flex", justifyContent: "center", gap: "80px", flexWrap: "wrap" }}>
        {[
          { num: "10,000+", label: "Students" },
          { num: "500+", label: "Courses" },
          { num: "100+", label: "Instructors" },
          { num: "4.8★", label: "Avg Rating" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "34px", fontWeight: "800", color: "#1c1d1f" }}>{s.num}</div>
            <div style={{ fontSize: "15px", color: "#6b7280", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section style={{ padding: "64px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "32px", color: "#1c1d1f" }}>
          Top Categories
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
          {["Web Development", "Data Science", "Mobile Apps", "UI/UX Design", "Cyber Security", "Machine Learning", "Digital Marketing", "Blockchain"].map((cat) => (
            <div key={cat} style={{
              padding: "20px 16px", border: "1px solid #e5e7eb", borderRadius: "8px",
              cursor: "pointer", textAlign: "center", fontWeight: "600", color: "#1c1d1f",
              fontSize: "14px", background: "#fff",
            }}>
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#f7f9fa", padding: "64px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "48px", color: "#1c1d1f" }}>
            How EduFlex Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "36px" }}>
            {[
              { icon: "📝", title: "Register", desc: "Create your free account as a student or instructor." },
              { icon: "🔍", title: "Browse Courses", desc: "Explore hundreds of expert-led courses across categories." },
              { icon: "🎓", title: "Enroll & Learn", desc: "Watch video lessons and track your progress." },
              { icon: "🏆", title: "Earn Certificate", desc: "Complete courses and showcase your new skills." },
            ].map((step) => (
              <div key={step.title} style={{ padding: "28px 20px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>{step.icon}</div>
                <h3 style={{ fontWeight: "700", fontSize: "18px", marginBottom: "10px", color: "#1c1d1f" }}>{step.title}</h3>
                <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 40px", textAlign: "center", background: "#1c1d1f" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", marginBottom: "16px" }}>
          Ready to start your learning journey?
        </h2>
        <p style={{ color: "#9ca3af", marginBottom: "28px", fontSize: "17px" }}>
          Join EduFlex today — it's free to get started.
        </p>
        <Link href="/register" style={{
          padding: "14px 36px", background: "#a435f0", borderRadius: "6px",
          color: "#fff", textDecoration: "none", fontWeight: "700", fontSize: "17px",
        }}>
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px 40px", borderTop: "1px solid #e5e7eb", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
        © 2026 EduFlex LMS. All rights reserved.
      </footer>
    </main>
  );
}