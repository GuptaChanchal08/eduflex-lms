import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardRouter() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  if (role === "student") redirect("/dashboard/student");
  if (role === "instructor") redirect("/dashboard/instructor");
  if (role === "admin") redirect("/dashboard/admin");

  redirect("/");
}