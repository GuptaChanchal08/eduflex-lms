import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth/password";

export async function GET() {
  await connectDB();

  const user = await User.create({
    firstName: "Test",
    lastName: "User",
    email: "testuser@example.com",
    password: await hashPassword("password123"),
    role: "student",
  });

  return NextResponse.json({
    success: true,
    user,
  });
}