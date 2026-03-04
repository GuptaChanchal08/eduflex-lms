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
    const db = client.db("edunest_lms");

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
    return NextResponse.json(
      { error: "Failed to fetch enrolled courses" },
      { status: 500 }
    );
  }
}