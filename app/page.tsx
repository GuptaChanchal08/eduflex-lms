import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Welcome to EduNest LMS</h1>
      <p className="mt-4">Learn. Grow. Succeed.</p>

      <div className="mt-6">
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </main>
  );
}