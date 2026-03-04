import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

function generateCourses() {
  const categories = [
    "Web Development",
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Data Science",
    "Mobile Development",
    "Cyber Security"
  ];

  const titles = [
    "Complete Bootcamp",
    "Masterclass",
    "Zero to Hero",
    "Advanced Guide",
    "Ultimate Course",
    "Professional Certification",
    "Hands-on Training",
    "Practical Workshop"
  ];

  const technologies = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "MongoDB",
    "Next.js",
    "AWS",
    "Docker",
    "Machine Learning",
    "UI/UX",
    "Digital Marketing",
    "Cyber Security",
    "Flutter",
    "Blockchain",
    "SQL"
  ];

  const courses = [];

  for (let i = 1; i <= 40; i++) {
    const tech = technologies[Math.floor(Math.random() * technologies.length)];
    const titleType = titles[Math.floor(Math.random() * titles.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    courses.push({
      title: `${tech} ${titleType}`,
      description: `Comprehensive course covering ${tech} from beginner to advanced level with real-world projects.`,
      price: Math.floor(Math.random() * 5000) + 999,
      category,
      instructorId: "seeded-instructor",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return courses;
}

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("edunest_lms");

    const courses = generateCourses();

    await db.collection("courses").insertMany(courses);

    return NextResponse.json({
      message: "40 courses seeded successfully",
      count: courses.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Seeding failed" },
      { status: 500 }
    );
  }
}