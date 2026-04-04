import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ManageUsersClient from "@/components/ManageUsersClient";

export default async function ManageUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard");

  const users = await db.user.findMany({
    select: {
      id: true, name: true, email: true,
      role: true, avatar: true, createdAt: true,
      _count: { select: { bookings: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <ManageUsersClient users={users} />
    </div>
  );
}