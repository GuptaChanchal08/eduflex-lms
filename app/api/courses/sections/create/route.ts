import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Sections create API working. Use POST to create section.",
  });
}
// import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Section from "@/models/Section";
import Course from "@/models/Course";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * POST → Create a section inside a course
 */
export async function POST(req: Request) {
  try {
    // 🔐 Auth check
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!["admin", "instructor"].includes(user.role)) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const body = JSON.parse(await req.text());
    const { title, courseId, order } = body;

    if (!title || !courseId) {
      return NextResponse.json(
        { message: "Title and Course ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Ensure course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    const section = await Section.create({
      title,
      course: courseId,
      order: order || 1,
    });

    return NextResponse.json({
      success: true,
      section,
    });
  } catch (error: any) {
    console.error("SECTION ERROR 👉", error);
    return NextResponse.json(
      { message: "Failed to create section" },
      { status: 500 }
    );
  }
}