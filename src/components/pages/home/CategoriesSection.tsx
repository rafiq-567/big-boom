import Link from "next/link";

const categories = [
  {
    name: "Sofas",
    count: "24 items",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    href: "/shop?category=Sofa",
    color: "from-yellow-400/20",
  },
  {
    name: "Beds",
    count: "18 items",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
    href: "/shop?category=Bed",
    color: "from-blue-400/20",
  },
  {
    name: "Tables",
    count: "32 items",
    image: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=400",
    href: "/shop?category=Table",
    color: "from-green-400/20",
  },
  {
    name: "Chairs",
    count: "45 items",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
    href: "/shop?category=Chair",
    color: "from-purple-400/20",
  },
  {
    name: "Wardrobes",
    count: "12 items",
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400",
    href: "/shop?category=Wardrobe",
    color: "from-red-400/20",
  },
  {
    name: "Desks",
    count: "20 items",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400",
    href: "/shop?category=Desk",
    color: "from-orange-400/20",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
            Browse By Category
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Shop Our Collections
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our wide range of furniture categories, carefully curated
            to match every style and budget.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-xl hover:bg-yellow-700 transition font-semibold"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}