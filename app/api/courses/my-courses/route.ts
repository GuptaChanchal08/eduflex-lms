import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    const courses = await db
      .collection("courses")
      .find({ instructorId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    // Get enrollment count per course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollments = await db
          .collection("enrollments")
          .countDocuments({ courseId: course._id.toString() });
        return { ...course, enrollments };
      })
    );

    return NextResponse.json(coursesWithStats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}