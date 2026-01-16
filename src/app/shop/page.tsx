import { db } from "@/lib/db"; // আপনার ডাটাবেস কানেকশন ইম্পোর্ট করুন

export default async function ShopPage() {
  // ১. ডাটাবেস থেকে সব প্রোডাক্ট নিয়ে আসা
  const products = await db.product.findMany({
    orderBy: {
      createdAt: 'desc' // নতুন ফার্নিচারগুলো আগে দেখাবে
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Furniture Collection</h1>

      {/* ২. চেক করা যদি কোনো প্রোডাক্ট না থাকে */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No furniture found. Please add some from the dashboard!</p>
      ) : (
        // ৩. গ্রিড আকারে প্রোডাক্টগুলো দেখানো
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white">
              {/* ছবি আপাতত ডামি হিসেবে দিচ্ছি */}
              <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Furniture Image</span>
              </div>
              
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{product.category}</p>
              <p className="text-lg font-bold text-blue-600">${product.price}</p>
              
              <button className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}