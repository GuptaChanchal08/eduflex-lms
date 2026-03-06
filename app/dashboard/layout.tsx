import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const name = session?.user?.name || "User";

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: "260px", minWidth: "260px",
        background: "#1c1d1f", color: "#ffffff",
        display: "flex", flexDirection: "column",
        borderRight: "1px solid #374151",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #374151" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ width: "32px", height: "32px", background: "#a435f0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: "800", fontSize: "16px" }}>E</span>
            </div>
            <span style={{ fontWeight: "800", fontSize: "18px", color: "#fff" }}>EduFlex</span>
          </Link>
        </div>

        {/* User info */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #374151" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "#a435f0", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: "700", color: "#fff",
            }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>{name}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "capitalize" as const }}>{role}</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "16px 0" }}>
          {role === "student" && (
            <>
              <NavSection label="Student" />
              <SidebarLink href="/dashboard/student" icon="🏠">Dashboard</SidebarLink>
              <SidebarLink href="/dashboard/student/courses" icon="🔍">Browse Courses</SidebarLink>
              <SidebarLink href="/dashboard/student/my-learning" icon="📖">My Learning</SidebarLink>
              <SidebarLink href="/dashboard/student/progress" icon="📊">My Progress</SidebarLink>
            </>
          )}

          {role === "instructor" && (
            <>
              <NavSection label="Instructor" />
              <SidebarLink href="/dashboard/instructor" icon="🏠">Dashboard</SidebarLink>
              <SidebarLink href="/dashboard/instructor/courses" icon="📚">My Courses</SidebarLink>
              <SidebarLink href="/dashboard/instructor/create" icon="➕">Create Course</SidebarLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavSection label="Admin" />
              <SidebarLink href="/dashboard/admin" icon="🏠">Dashboard</SidebarLink>
              <SidebarLink href="/dashboard/admin/users" icon="👥">Manage Users</SidebarLink>
              <SidebarLink href="/dashboard/admin/courses" icon="📚">Manage Courses</SidebarLink>
            </>
          )}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #374151" }}>
          <Link
            href="/api/auth/signout"
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              color: "#9ca3af", textDecoration: "none", fontSize: "14px",
              padding: "8px 12px", borderRadius: "6px",
            }}
          >
            <span>🚪</span> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: "#f8fafc", overflowY: "auto" }}>
        {/* Top bar */}
        <div style={{
          height: "64px", background: "#fff", borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", padding: "0 32px",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Welcome back, <strong style={{ color: "#1c1d1f" }}>{name}</strong>
          </div>
        </div>
        <div style={{ padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}

function NavSection({ label }: { label: string }) {
  return (
    <div style={{
      padding: "6px 24px 4px",
      fontSize: "10px", fontWeight: "700", color: "#6b7280",
      textTransform: "uppercase" as const, letterSpacing: "0.08em",
      marginTop: "8px",
    }}>
      {label}
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 24px", color: "#d1d5db",
        textDecoration: "none", fontSize: "14px", fontWeight: "500",
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      {children}
    </Link>
  );
}