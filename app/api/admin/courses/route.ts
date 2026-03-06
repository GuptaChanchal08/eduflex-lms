import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    const courses = await db.collection("courses").find({}).sort({ createdAt: -1 }).toArray();

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollments = await db
          .collection("enrollments")
          .countDocuments({ courseId: course._id.toString() });
        const instructor = await db
          .collection("users")
          .findOne(
            { _id: new ObjectId(course.instructorId) },
            { projection: { firstName: 1, lastName: 1, email: 1 } }
          );
        return { ...course, enrollments, instructor };
      })
    );

    return NextResponse.json(coursesWithStats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    await db.collection("courses").deleteOne({ _id: new ObjectId(courseId) });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}