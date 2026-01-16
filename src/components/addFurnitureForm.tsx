// components/AddFurnitureForm.tsx
"use client"

import { addFurniture } from "@/app/actions/furniture";
import { PlusCircle } from "lucide-react";

export default function AddFurnitureForm() {
  async function handleSubmit(formData: FormData) {
    const result = await addFurniture(formData);
    if (result.success) {
      alert("Furniture added successfully!");
    } else {
      alert("Something went wrong!");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100 mt-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PlusCircle className="w-6 h-6" /> Add New Furniture
      </h2>
      
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input name="name" required className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="E.g. Luxury Sofa" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" className="w-full p-2 border rounded-md outline-none">
            <option value="Sofa">Sofa</option>
            <option value="Bed">Bed</option>
            <option value="Table">Table</option>
            <option value="Chair">Chair</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input name="price" type="number" step="0.01" required className="w-full p-2 border rounded-md outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input name="stock" type="number" required className="w-full p-2 border rounded-md outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows={3} className="w-full p-2 border rounded-md outline-none" placeholder="Describe the furniture..."></textarea>
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
          Save Product
        </button>
      </form>
    </div>
  );
}