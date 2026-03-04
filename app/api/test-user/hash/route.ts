import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const hash = await bcrypt.hash("123456", 10);
  return NextResponse.json({ hash });
}