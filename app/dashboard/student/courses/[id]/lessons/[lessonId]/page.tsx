import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

export default async function LessonPage(
  props: {
    params: Promise<{
      courseId: string;
      lessonId: string;
    }>;
  }
) {
  const { courseId, lessonId } = await props.params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db("edunest_lms");

  // ✅ Check enrollment
  const enrollment = await db.collection("enrollments").findOne({
    courseId,
    studentId: session.user.id,
  });

  if (!enrollment) {
    redirect("/dashboard/student/browse");
  }

  // ✅ Fetch lesson
  const lesson = await db
    .collection("lessons")
    .findOne({ _id: new ObjectId(lessonId) });

  if (!lesson) {
    return <div className="p-6">Lesson not found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        {lesson.title}
      </h1>

      <div className="aspect-video bg-black rounded overflow-hidden">
        <video
          controls
          className="w-full h-full"
          src={lesson.videoUrl}
        />
      </div>

      <div className="mt-6 text-gray-600">
        Duration: {lesson.duration} seconds
      </div>
    </div>
  );
}