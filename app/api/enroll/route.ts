import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    const enrollments = await db
      .collection("enrollments")
      .find({ studentId: session.user.id })
      .toArray();

    const courseIds = enrollments.map((e) => new ObjectId(e.courseId));

    const courses = await db
      .collection("courses")
      .find({ _id: { $in: courseIds } })
      .toArray();

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch enrolled courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "student") {
      return NextResponse.json({ error: "Only students can enroll" }, { status: 403 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    // Check course exists and is published
    const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check duplicate enrollment
    const existing = await db.collection("enrollments").findOne({
      studentId: session.user.id,
      courseId,
    });

    if (existing) {
      return NextResponse.json({ message: "Already enrolled in this course" }, { status: 409 });
    }

    await db.collection("enrollments").insertOne({
      studentId: session.user.id,
      courseId,
      enrolledAt: new Date(),
    });

    return NextResponse.json({ message: "Enrolled successfully!" });
  } catch (error) {
    console.error("ENROLL ERROR:", error);
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}