import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (!["admin", "instructor"].includes(role)) {
      return NextResponse.json({ message: "Only admin or instructor can publish courses" }, { status: 403 });
    }

    const { courseId, status } = await req.json();

    const client = await clientPromise;
    const db = client.db("eduflex_lms");

    await db.collection("courses").updateOne(
      { _id: new ObjectId(courseId) },
      { $set: { status: status || "published", updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: `Course ${status || "published"} successfully` });
  } catch (error) {
    return NextResponse.json({ message: "Course publish failed" }, { status: 500 });
  }
}