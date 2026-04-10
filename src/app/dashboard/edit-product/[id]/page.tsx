import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import EditProductForm from "@/components/EditProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;

  const product = await db.product.findUnique({ where: { id } });
  if (!product) redirect("/dashboard/products");

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/products"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <EditProductForm product={product} />
    </div>
  );
}