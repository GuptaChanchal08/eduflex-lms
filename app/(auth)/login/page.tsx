"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   await signIn("credentials", {
  //     email,
  //     password,
  //     callbackUrl: "/dashboard",
  //   });
  // };
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  await signIn("credentials", {
    email,
    password,
    redirect: true,
    callbackUrl: "/dashboard",
  });
};

  return (
    <form onSubmit={handleLogin} className="p-10">
      <h2 className="text-xl font-bold">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 block mt-4"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 block mt-4"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="mt-4 px-4 py-2 bg-black text-white">
        Login
      </button>
    </form>
  );
}