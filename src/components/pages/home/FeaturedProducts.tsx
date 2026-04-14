import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  images: string[];
  category: string;
  stock: number;
}

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
  
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
              Hand Picked
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-500">
              Our most popular pieces loved by customers.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-yellow-600 font-semibold hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group border rounded-2xl overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52 bg-gray-100">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                  {product.category}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-500">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-yellow-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <Link href={`/shop/${product.id}`}>
                    <button className="flex items-center gap-1 bg-black text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-800 transition">
                      <ShoppingCart className="w-3 h-3" />
                      View
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}