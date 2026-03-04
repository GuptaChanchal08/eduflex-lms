import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentCoursePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db("edunest_lms");

  const course = await db
    .collection("courses")
    .findOne({ _id: new ObjectId(id) });

  if (!course) {
    return <div className="p-6">Course not found</div>;
  }

  const enrollment = await db.collection("enrollments").findOne({
    courseId: id,
    studentId: session.user.id,
  });

  if (!enrollment) {
    redirect("/dashboard/student/browse");
  }

  const sections = await db
    .collection("sections")
    .find({ courseId: id })
    .sort({ order: 1 })
    .toArray();

  const lessons = await db
    .collection("lessons")
    .find({ courseId: id })
    .sort({ order: 1 })
    .toArray();

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r p-6 bg-gray-50">
        <h2 className="font-bold text-lg mb-6">Curriculum</h2>

        {sections.map((section: any) => (
          <div key={section._id.toString()} className="mb-6">
            <h3 className="font-semibold text-gray-800">
              {section.title}
            </h3>

            {lessons
              .filter(
                (lesson: any) =>
                  lesson.sectionId === section._id.toString()
              )
              .map((lesson: any) => (
                <Link
                  key={lesson._id.toString()}
                  href={`/dashboard/student/courses/${id}/lessons/${lesson._id}`}
                  className="block pl-4 mt-2 text-sm text-gray-600 hover:text-black"
                >
                  • {lesson.title}
                </Link>
              ))}
          </div>
        ))}
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="w-2/3 p-8">
        <h1 className="text-3xl font-bold mb-4">
          {course.title}
        </h1>

        <p className="text-gray-700 mb-6">
          {course.description}
        </p>

        <div className="p-6 bg-white shadow rounded">
          <p>Select a lesson from the curriculum.</p>
        </div>
      </div>
    </div>
  );
}