import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Progress from "@/models/Progress";
import Section from "@/models/Section";
import Lesson from "@/models/Lesson";
import Enrollment from "@/models/Enrollment";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * GET → Fetch course progress & completion status
 */
export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // 1️⃣ Authentication
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);

    if (user.role !== "student")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await connectDB();

    // 2️⃣ Ensure enrollment
    const enrollment = await Enrollment.findOne({
      student: user.id,
      course: params.courseId,
    });

    if (!enrollment)
      return NextResponse.json(
        { message: "Not enrolled in course" },
        { status: 403 }
      );

    // 3️⃣ Fetch all lessons in course
    const sections = await Section.find({ course: params.courseId });
    const sectionIds = sections.map((s) => s._id);

    const lessons = await Lesson.find({
      section: { $in: sectionIds },
    });

    const totalLessons = lessons.length;

    // 4️⃣ Fetch progress
    const progress = await Progress.findOne({
      student: user.id,
      course: params.courseId,
    });

    const completedLessons = progress?.completedLessons.length || 0;

    const percentage =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    return NextResponse.json({
      success: true,
      totalLessons,
      completedLessons,
      percentage,
      completed: percentage === 100,
    });
  } catch (error) {
    console.error("PROGRESS STATUS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}