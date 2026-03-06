import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

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
    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) });
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    const sections = await db
      .collection("sections")
      .find({ courseId })
      .sort({ order: 1 })
      .toArray();

    const curriculum = await Promise.all(
      sections.map(async (section) => {
        const lessons = await db
          .collection("lessons")
          .find({ sectionId: section._id.toString() })
          .sort({ order: 1 })
          .toArray();
        return { section, lessons };
      })
    );

    return NextResponse.json({ success: true, course, curriculum });
  } catch (error) {
    console.error("CURRICULUM ERROR:", error);
    return NextResponse.json({ message: "Failed to load curriculum" }, { status: 500 });
  }
}