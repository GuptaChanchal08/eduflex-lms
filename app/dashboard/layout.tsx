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

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          background: "#0f172a",
          color: "#ffffff",
          padding: "25px",
        }}
      >
        <h2 style={{ marginBottom: "30px", fontSize: "20px", fontWeight: "bold" }}>
          EduNest
        </h2>

        {role === "student" && (
          <>
            <SidebarLink href="/dashboard/student">
              Dashboard
            </SidebarLink>

            <SidebarLink href="/dashboard/student/courses">
              Browse Courses
            </SidebarLink>

            <SidebarLink href="/dashboard/student/my-learning">
              My Learning
            </SidebarLink>
          </>
        )}

        {role === "instructor" && (
          <>
            <SidebarLink href="/dashboard/instructor">
              Dashboard
            </SidebarLink>

            <SidebarLink href="/dashboard/instructor/courses">
              My Courses
            </SidebarLink>

            <SidebarLink href="/dashboard/instructor/create">
              Create Course
            </SidebarLink>
          </>
        )}

        {role === "admin" && (
          <>
            <SidebarLink href="/dashboard/admin">
              Dashboard
            </SidebarLink>

            <SidebarLink href="/dashboard/admin/users">
              Users
            </SidebarLink>

            <SidebarLink href="/dashboard/admin/courses">
              Courses
            </SidebarLink>
          </>
        )}

        <div style={{ marginTop: "40px" }}>
          <SidebarLink href="/api/auth/signout">
            Logout
          </SidebarLink>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "40px",
          background: "#f1f5f9",
        }}
      >
        {children}
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <Link
        href={href}
        style={{
          color: "#cbd5e1",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        {children}
      </Link>
    </div>
  );
}