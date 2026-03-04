"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("User created successfully");
    } else {
      alert("Error creating user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-10">
      <h2 className="text-xl font-bold">Register</h2>

      <input
        placeholder="First Name"
        className="border p-2 block mt-4"
        onChange={(e) =>
          setForm({ ...form, firstName: e.target.value })
        }
      />

      <input
        placeholder="Last Name"
        className="border p-2 block mt-4"
        onChange={(e) =>
          setForm({ ...form, lastName: e.target.value })
        }
      />

      <input
        placeholder="Email"
        className="border p-2 block mt-4"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 block mt-4"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <select
        className="border p-2 block mt-4"
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
      </select>

      <button className="mt-4 px-4 py-2 bg-green-600 text-white">
        Register
      </button>
    </form>
  );
}