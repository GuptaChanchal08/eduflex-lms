"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  let links = [];

  if (pathname.startsWith("/dashboard/admin")) {
    links = [
      { href: "/dashboard/admin", label: "Overview" },
      { href: "/dashboard/admin/users", label: "Users" },
      { href: "/dashboard/admin/courses", label: "Courses" },
    ];
  } else if (pathname.startsWith("/dashboard/instructor")) {
    links = [
      { href: "/dashboard/instructor", label: "Dashboard" },
      { href: "/dashboard/instructor/courses", label: "My Courses" },
      { href: "/dashboard/instructor/create", label: "Create Course" },
    ];
  } else {
    links = [
      { href: "/dashboard/student", label: "Dashboard" },
      { href: "/dashboard/student/courses", label: "My Courses" },
      { href: "/dashboard/student/progress", label: "Progress" },
    ];
  }

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">EduFlex</h2>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded-md text-sm ${
              pathname === link.href
                ? "bg-gray-100 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}