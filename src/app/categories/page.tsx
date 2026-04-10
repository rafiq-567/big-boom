import Link from "next/link";
import { db } from "@/lib/db";

export default async function CategoriesPage() {
  const categoryCounts = await db.product.groupBy({
    by: ["category"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const categoryImages: Record<string, string> = {
    Sofa: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    Bed: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
    Table: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=600",
    Chair: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600",
    Wardrobe: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600",
    Desk: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600",
    Shelf: "https://images.unsplash.com/photo-1588200618450-3a5b1d3b9aa5?w=600",
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
            Browse
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            All Categories
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Find exactly what you're looking for by browsing our carefully
            curated furniture categories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryCounts.map((cat) => (
            <Link
              key={cat.category}
              href={`/shop?category=${cat.category}`}
            >
              <div className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer">
                <img
                  src={
                    categoryImages[cat.category] ||
                    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"
                  }
                  alt={cat.category}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl font-bold text-white">
                    {cat.category}
                  </h2>
                  <p className="text-gray-300 text-sm">
                    {cat._count.id} products available
                  </p>
                </div>
                <div className="absolute top-4 right-4 bg-yellow-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                  Shop Now →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categoryCounts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No categories yet.</p>
            <Link
              href="/shop"
              className="mt-4 inline-block bg-yellow-600 text-white px-6 py-2 rounded-xl hover:bg-yellow-700 transition"
            >
              Browse Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}