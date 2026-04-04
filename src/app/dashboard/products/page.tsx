import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ManageProductsClient from "@/components/ManageProductsClient";
import Link from "next/link";

export default async function ManageProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard");

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { reviews: true, bookings: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          href="/dashboard/add-furniture"
          className="bg-yellow-600 text-white px-4 py-2 rounded-xl hover:bg-yellow-700 transition text-sm"
        >
          + Add Product
        </Link>
      </div>
      <ManageProductsClient products={products} />
    </div>
  );
}