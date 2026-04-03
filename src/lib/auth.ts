import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getSession = () => getServerSession(authOptions);

export const requireAuth = async () => {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
};

export const requireAdmin = async () => {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  if ((session.user as any)?.role !== "ADMIN") throw new Error("Forbidden");
  return session;
};