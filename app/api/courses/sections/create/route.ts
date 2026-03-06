import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  return NextResponse.json({ message: "Sections API. Use POST to create a section." });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (!["admin", "instructor"].includes(role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { title, courseId, order } = await req.json();

    if (!title || !courseId) {
      return NextResponse.json({ message: "Title and Course ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) });
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    const result = await db.collection("sections").insertOne({
      title,
      courseId,
      order: order || 1,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, sectionId: result.insertedId });
  } catch (error) {
    console.error("SECTION ERROR:", error);
    return NextResponse.json({ message: "Failed to create section" }, { status: 500 });
  }
}