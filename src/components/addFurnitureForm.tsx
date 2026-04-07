"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2, Sparkles } from "lucide-react";

export default function AddFurnitureForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Sofa");
  const [price, setPrice] = useState("");

  const handleAIGenerate = async () => {
    if (!name) {
      setError("Please enter a product name first to generate description.");
      return;
    }
    setAiLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, price }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "AI generation failed");
        return;
      }

      setDescription(data.data.description);
    } catch {
      setError("AI service unavailable. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name") as string,
      description: description || (formData.get("description") as string),
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      stock: formData.get("stock") as string,
      location: (formData.get("location") as string) || "",
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
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Sofa");
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
            placeholder="E.g. Luxury Sofa"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="Sofa">Sofa</option>
            <option value="Bed">Bed</option>
            <option value="Table">Table</option>
            <option value="Chair">Chair</option>
            <option value="Wardrobe">Wardrobe</option>
          </select>
        </div>

        {/* Price */}
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="0.00"
          />
        </div>

        {/* Stock */}
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

        {/* Location */}
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

        {/* Description with AI Button */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={aiLoading}
              className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 border border-yellow-300 px-2 py-1 rounded-lg hover:bg-yellow-100 transition disabled:opacity-50"
            >
              {aiLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {aiLoading ? "Generating..." : "AI Generate"}
            </button>
          </div>
          <textarea
            name="description"
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            placeholder="Describe the furniture or click AI Generate..."
          />
          {description && (
            <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI generated — feel free to edit
            </p>
          )}
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