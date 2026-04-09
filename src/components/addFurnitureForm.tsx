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
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Sofa");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleAIGenerate = async () => {
    if (!name.trim()) {
      setError("Please enter a product name first.");
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
        setError(data.message || "AI generation failed.");
        return;
      }

      setDescription(data.data.description);
    } catch {
      setError("AI service unavailable. Please write description manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const body = {
      name,
      description,
      category,
      price,
      stock,
      location: location || "",
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
      setStock("");
      setLocation("");
      setCategory("Sofa");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100 mt-10">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <PlusCircle className="w-6 h-6" /> Add New Furniture
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Fill in the details. Use AI to auto-generate a description.
      </p>

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
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
            placeholder="E.g. Luxury Velvet Sofa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
          >
            <option value="Sofa">Sofa</option>
            <option value="Bed">Bed</option>
            <option value="Table">Table</option>
            <option value="Chair">Chair</option>
            <option value="Wardrobe">Wardrobe</option>
            <option value="Shelf">Shelf</option>
            <option value="Desk">Desk</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
            placeholder="E.g. Dhaka"
          />
        </div>

        {/* Description with AI Generate button */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={aiLoading}
              className="flex items-center gap-1.5 text-xs bg-yellow-50 text-yellow-700 border border-yellow-300 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  AI Generate
                </>
              )}
            </button>
          </div>

          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 resize-none text-sm"
            placeholder="Describe the furniture or click AI Generate above..."
          />

          {description && !aiLoading && (
            <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI generated — feel free to edit before saving
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !name || !description || !price || !stock}
          className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
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