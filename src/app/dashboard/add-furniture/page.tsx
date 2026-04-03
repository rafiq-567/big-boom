// import AddFurnitureForm from "@/components/addFurnitureForm";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export default function AddFurniturePage() {
//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-10">
//       <div className="max-w-4xl mx-auto">
//         {/* উপরের নেভিগেশন/হেডার অংশ */}
//         <div className="mb-8">
//           <Link 
//             href="/dashboard" 
//             className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition mb-4"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back to Dashboard
//           </Link>
          
//           <h1 className="text-3xl font-bold text-gray-900">Add New Furniture</h1>
//           <p className="text-gray-500">Fill in the details below to add a new product to your shop.</p>
//         </div>

//         {/* আপনার আগে তৈরি করা ফর্মটি এখানে বসিয়ে দিন */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-1"> {/* ফর্মের চারপাশে হালকা প্যাডিং */}
//              <AddFurnitureForm />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2 } from "lucide-react";

export default function AddFurnitureForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      stock: formData.get("stock") as string,
      location: formData.get("location") as string || "",
      images: [],
      isFeatured: false,
    };

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setSuccess("Product added successfully!");
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100 mt-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PlusCircle className="w-6 h-6" /> Add New Furniture
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            name="name"
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
            placeholder="E.g. Luxury Sofa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="Sofa">Sofa</option>
            <option value="Bed">Bed</option>
            <option value="Table">Table</option>
            <option value="Chair">Chair</option>
            <option value="Wardrobe">Wardrobe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            name="location"
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="E.g. Dhaka"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            required
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Describe the furniture..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </button>
      </form>
    </div>
  );
}