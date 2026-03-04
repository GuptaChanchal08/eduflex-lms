import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Progress from "@/models/Progress";
import Enrollment from "@/models/Enrollment";
import Lesson from "@/models/Lesson";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * POST → Mark a lesson as completed
 */
export async function POST(req: Request) {
  try {
    // 1️⃣ Authentication
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);

    if (user.role !== "student")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // 2️⃣ Read request body
    const body = JSON.parse(await req.text());
    const { courseId, lessonId } = body;

    if (!courseId || !lessonId)
      return NextResponse.json(
        { message: "Course ID and Lesson ID required" },
        { status: 400 }
      );

    await connectDB();

    // 3️⃣ Ensure student is enrolled
    const enrollment = await Enrollment.findOne({
      student: user.id,
      course: courseId,
    });

    if (!enrollment)
      return NextResponse.json(
        { message: "Not enrolled in course" },
        { status: 403 }
      );

    // 4️⃣ Validate lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson)
      return NextResponse.json(
        { message: "Lesson not found" },
        { status: 404 }
      );

    // 5️⃣ Upsert progress
    const progress = await Progress.findOneAndUpdate(
      { student: user.id, course: courseId },
      { $addToSet: { completedLessons: lessonId } }, // prevents duplicates
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Lesson marked as completed",
      progress,
    });
  } catch (error) {
    console.error("PROGRESS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update progress" },
      { status: 500 }
    );
  }
}