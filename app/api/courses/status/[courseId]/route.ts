import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;
    const studentId = session.user.id;

    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    const sections = await db.collection("sections").find({ courseId }).toArray();
    const sectionIds = sections.map((s) => s._id.toString());

    const lessons = await db
      .collection("lessons")
      .find({ sectionId: { $in: sectionIds } })
      .toArray();

    const totalLessons = lessons.length;

    const progress = await db.collection("progress").findOne({ studentId, courseId });
    const completedLessons = progress?.completedLessons?.length || 0;
    const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    return NextResponse.json({
      success: true,
      totalLessons,
      completedLessons,
      percentage,
      completed: percentage === 100,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch progress" }, { status: 500 });
  }
}