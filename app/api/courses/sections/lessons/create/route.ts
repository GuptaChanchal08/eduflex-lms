import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Lesson from "@/models/Lesson";
import Section from "@/models/Section";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * POST → Create lesson inside a section
 */
export async function POST(req: Request) {
  try {
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
    const {
      title,
      sectionId,
      contentType,
      contentUrl,
      textContent,
      order,
    } = body;

    if (!title || !sectionId || !contentType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const section = await Section.findById(sectionId);
    if (!section) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 }
      );
    }

    const lesson = await Lesson.create({
      title,
      section: sectionId,
      contentType,
      contentUrl,
      textContent,
      order: order || 1,
    });

    return NextResponse.json({
      success: true,
      lesson,
    });
  } catch (error: any) {
    console.error("LESSON ERROR 👉", error);
    return NextResponse.json(
      { message: "Failed to create lesson" },
      { status: 500 }
    );
  }
}