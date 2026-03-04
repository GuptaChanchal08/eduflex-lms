"use client";

import { useState } from "react";

export default function CreateCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/courses/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
    });

    if (res.ok) {
      alert("Course created successfully");
      setForm({ title: "", description: "", price: "", category: "" });
    } else {
      alert("Error creating course");
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        color: "#111827",
        padding: "30px",
        borderRadius: "10px",
        maxWidth: "600px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h1 style={{ marginBottom: "25px" }}>Create Course</h1>

      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Course Title"
          value={form.title}
          onChange={(value) => setForm({ ...form, title: value })}
        />

        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
        />

        <Input
          placeholder="Price"
          value={form.price}
          onChange={(value) => setForm({ ...form, price: value })}
        />

        <Input
          placeholder="Category"
          value={form.category}
          onChange={(value) => setForm({ ...form, category: value })}
        />

        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "12px 20px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Create Course
        </button>
      </form>
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#111827",
        backgroundColor: "#ffffff",
      }}
    />
  );
}

function Textarea({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        minHeight: "100px",
        fontSize: "14px",
        color: "#111827",
        backgroundColor: "#ffffff",
      }}
    />
  );
}