import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * GET → Browser-safe test
 */
export async function GET() {
  return NextResponse.json({
    message: "Enroll API working. Use POST to enroll.",
  });
}

/**
 * POST → Student enrolls in a published course
 */
export async function POST(req: Request) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);

    // Only students can enroll
    if (user.role !== "student")
      return NextResponse.json({ message: "Only students can enroll" }, { status: 403 });

    const body = JSON.parse(await req.text());
    const { courseId } = body;

    if (!courseId)
      return NextResponse.json({ message: "Course ID required" }, { status: 400 });

    await connectDB();

    // Ensure course exists & is published
    const course = await Course.findById(courseId);
    if (!course || !course.published)
      return NextResponse.json(
        { message: "Course not available for enrollment" },
        { status: 404 }
      );

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: user.id,
      course: courseId,
    });

    return NextResponse.json({
      success: true,
      message: "Enrollment successful",
      enrollment,
    });
  } catch (error: any) {
    // Handles duplicate enrollment error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Already enrolled in this course" },
        { status: 409 }
      );
    }

    console.error("ENROLL ERROR:", error);
    return NextResponse.json(
      { message: "Enrollment failed" },
      { status: 500 }
    );
  }
}