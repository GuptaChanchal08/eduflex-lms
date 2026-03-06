import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId, lessonId } = await req.json();
    if (!courseId || !lessonId) {
      return NextResponse.json({ message: "Course ID and Lesson ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    const studentId = session.user.id;

    const existing = await db.collection("progress").findOne({ studentId, courseId });

    if (existing) {
      if (!existing.completedLessons.includes(lessonId)) {
        await db.collection("progress").updateOne(
          { studentId, courseId },
          { $push: { completedLessons: lessonId } as any }
        );
      }
    } else {
      await db.collection("progress").insertOne({
        studentId,
        courseId,
        completedLessons: [lessonId],
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, message: "Lesson marked as completed" });
  } catch (error) {
    console.error("PROGRESS ERROR:", error);
    return NextResponse.json({ message: "Failed to update progress" }, { status: 500 });
  }
}