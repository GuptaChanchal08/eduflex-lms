"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <button
        onClick={handleLogout}
        className="text-sm text-gray-600 hover:text-black"
      >
        Logout
      </button>
    </header>
  );
}