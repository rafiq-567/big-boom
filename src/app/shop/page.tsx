
export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

export default async function ShopPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-8 pt-24">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Our Furniture Collection
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          No products yet. Add some from the dashboard!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="w-full h-48 bg-gray-100 relative">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase mb-1">
                  {product.category}
                </p>
                <h2 className="text-lg font-semibold mb-1 truncate">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-yellow-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ⭐ {product.rating.toFixed(1)}
                  </span>
                </div>
                <Link href={`/shop/${product.id}`}>
                  <button className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}