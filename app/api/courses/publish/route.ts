import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * POST → Admin publishes a course
 */
export async function POST(req: Request) {
  try {
    // Extract token
    const token = req.headers
      .get("cookie")
      ?.split("token=")[1]
      ?.split(";")[0];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = verifyToken(token);

    // Only admin allowed
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can publish courses" },
        { status: 403 }
      );
    }

    const { courseId } = await req.json();

    await connectDB();

    const course = await Course.findByIdAndUpdate(
      courseId,
      { status: "published" },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Course published successfully",
      course,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Course publish failed" },
      { status: 500 }
    );
  }
}