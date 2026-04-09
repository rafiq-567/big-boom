import AddFurnitureForm from "@/components/addFurnitureForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddFurniturePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Add New Product
          </h1>
          <p className="text-gray-500">
            Fill in the details below to add a new product to your shop.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <AddFurnitureForm />
        </div>
      </div>
    </div>
  );
}