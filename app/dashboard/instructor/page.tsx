import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function InstructorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Instructor Dashboard</h1>
      <p>Welcome {session.user.name}</p>
    </div>
  );
}