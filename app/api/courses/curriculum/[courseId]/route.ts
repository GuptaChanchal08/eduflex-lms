import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Section from "@/models/Section";
import Lesson from "@/models/Lesson";
import Enrollment from "@/models/Enrollment";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * GET → Student views course curriculum
 */
export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);

    if (user.role !== "student")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await connectDB();

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      student: user.id,
      course: params.courseId,
    });

    if (!enrollment)
      return NextResponse.json(
        { message: "Not enrolled in this course" },
        { status: 403 }
      );

    // Fetch course
    const course = await Course.findById(params.courseId);
    if (!course || !course.published)
      return NextResponse.json({ message: "Course not found" }, { status: 404 });

    // Fetch sections
    const sections = await Section.find({ course: course._id }).sort("order");

    // Fetch lessons per section
    const curriculum = await Promise.all(
      sections.map(async (section) => {
        const lessons = await Lesson.find({ section: section._id }).sort("order");
        return {
          section,
          lessons,
        };
      })
    );

    return NextResponse.json({
      success: true,
      course,
      curriculum,
    });
  } catch (error) {
    console.error("CURRICULUM ERROR:", error);
    return NextResponse.json(
      { message: "Failed to load curriculum" },
      { status: 500 }
    );
  }
}