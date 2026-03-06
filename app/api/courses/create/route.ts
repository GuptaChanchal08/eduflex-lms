import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role;

  if (role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, price, category } = await req.json();

  if (!title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("eduflex_lms");

  await db.collection("courses").insertOne({
    title,
    description,
    price: price || 0,
    category: category || "General",
    instructorId: session.user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ message: "Course created successfully" });
}