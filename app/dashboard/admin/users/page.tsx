"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleActive = async (userId: string, current: boolean) => {
    setToggling(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, active: !current }),
    });
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, active: !current } : u));
    setToggling(null);
  };

  const filtered = users.filter(u => {
    const matchSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleColor = (role: string) => {
    if (role === "admin") return { bg: "#fee2e2", color: "#dc2626" };
    if (role === "instructor") return { bg: "#ede9fe", color: "#7c3aed" };
    return { bg: "#dbeafe", color: "#2563eb" };
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1c1d1f", marginBottom: "6px" }}>
          Manage Users
        </h1>
        <p style={{ color: "#6b7280" }}>{users.length} total users</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: "200px", padding: "10px 14px", border: "1px solid #d1d5db",
            borderRadius: "8px", fontSize: "14px", outline: "none",
          }}
        />
        {["all", "student", "instructor", "admin"].map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            style={{
              padding: "8px 16px", borderRadius: "999px", border: "none",
              background: roleFilter === role ? "#a435f0" : "#f1f5f9",
              color: roleFilter === role ? "#fff" : "#374151",
              cursor: "pointer", fontWeight: "600", fontSize: "13px", textTransform: "capitalize" as const,
            }}
          >
            {role}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>Loading users...</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1.5fr 100px 100px 100px",
            padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb",
            fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.05em",
          }}>
            <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span>Action</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>No users found.</div>
          ) : (
            filtered.map(user => {
              const rc = roleColor(user.role);
              return (
                <div key={user._id} style={{
                  display: "grid", gridTemplateColumns: "1fr 1.5fr 100px 100px 100px",
                  padding: "14px 20px", borderBottom: "1px solid #f1f5f9", alignItems: "center",
                }}>
                  <span style={{ fontWeight: "600", color: "#1c1d1f", fontSize: "14px" }}>
                    {user.firstName} {user.lastName}
                  </span>
                  <span style={{ color: "#6b7280", fontSize: "13px" }}>{user.email}</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", background: rc.bg, color: rc.color, borderRadius: "4px", width: "fit-content" }}>
                    {user.role}
                  </span>
                  <span style={{
                    fontSize: "11px", fontWeight: "700", padding: "3px 8px",
                    background: user.active ? "#dcfce7" : "#fee2e2",
                    color: user.active ? "#16a34a" : "#dc2626", borderRadius: "4px", width: "fit-content",
                  }}>
                    {user.active ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => toggleActive(user._id, user.active)}
                    disabled={toggling === user._id}
                    style={{
                      padding: "6px 12px", background: user.active ? "#fee2e2" : "#dcfce7",
                      color: user.active ? "#dc2626" : "#16a34a", border: "none",
                      borderRadius: "6px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
                    }}
                  >
                    {toggling === user._id ? "..." : user.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}