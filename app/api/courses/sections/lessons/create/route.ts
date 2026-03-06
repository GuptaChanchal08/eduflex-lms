import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

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

    const { title, sectionId, courseId, contentType, contentUrl, textContent, order } = await req.json();

    if (!title || !sectionId || !contentType || !courseId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    const section = await db.collection("sections").findOne({ _id: new ObjectId(sectionId) });
    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 });
    }

    const result = await db.collection("lessons").insertOne({
      title,
      sectionId,
      courseId,
      contentType,
      contentUrl: contentUrl || "",
      textContent: textContent || "",
      order: order || 1,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, lessonId: result.insertedId });
  } catch (error) {
    console.error("LESSON ERROR:", error);
    return NextResponse.json({ message: "Failed to create lesson" }, { status: 500 });
  }
}