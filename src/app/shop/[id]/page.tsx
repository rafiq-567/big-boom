import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReviewSection from "@/components/ReviewSection";
import AddToCartButton from "@/components/AddToCartButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      createdBy: { select: { name: true } },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) return notFound();

  const session = await getServerSession(authOptions);

  const relatedProducts = await db.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-yellow-600">Home</Link>
        {" / "}
        <Link href="/shop" className="hover:text-yellow-600">Shop</Link>
        {" / "}
        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gray-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-sm text-yellow-600 font-medium uppercase mb-2">
            {product.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-yellow-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              ⭐ {product.rating.toFixed(1)} ({product._count.reviews} reviews)
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400">Category</p>
              <p className="font-semibold">{product.category}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400">Stock</p>
              <p className="font-semibold">
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </p>
            </div>
            {product.location && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400">Location</p>
                <p className="font-semibold">{product.location}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400">Rating</p>
              <p className="font-semibold">{product.rating.toFixed(1)} / 5</p>
            </div>
          </div>

          <BookingButton
            productId={product.id}
            stock={product.stock}
            session={session}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection
        productId={product.id}
        reviews={product.reviews}
        session={session}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link href={`/shop/${p.id}`} key={p.id}>
                <div className="border rounded-xl overflow-hidden hover:shadow-md transition">
                  <div className="relative w-full h-40 bg-gray-100">
                    {p.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold truncate">{p.name}</p>
                    <p className="text-yellow-600 font-bold">${p.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingButton({
  productId,
  stock,
  session,
}: {
  productId: string;
  stock: number;
  session: any;
}) {
  if (!session) {
    return (
      <Link href="/login">
        <button className="w-full bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition font-semibold">
          Login to Order
        </button>
      </Link>
    );
  }

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl cursor-not-allowed font-semibold"
      >
        Out of Stock
      </button>
    );
  }

  return <PaymentForm productId={productId} />;
}

function PaymentForm({ productId }: { productId: string }) {
  return (
    <div className="space-y-3">
      <form
        action={async (formData: FormData) => {
          "use server";
          const { redirect } = await import("next/navigation");
          const { db } = await import("@/lib/db");
          const { getServerSession } = await import("next-auth");
          const { authOptions } = await import(
            "@/app/api/auth/[...nextauth]/route"
          );

          const session = await getServerSession(authOptions);
          if (!session || !session.user) {
            redirect("/login");
            return;
          }

          const userId = (session.user as any).id as string;
          if (!userId) {
            redirect("/login");
            return;
          }

          const quantity = parseInt(formData.get("quantity") as string);
          const product = await db.product.findUnique({
            where: { id: productId },
          });
          if (!product) return;

          const totalPrice = product.price * quantity;
          const transactionId = `TXN-${Date.now()}`;

          const booking = await db.booking.create({
            data: {
              userId,
              productId,
              quantity,
              price: totalPrice,
              status: "pending",
              transactionId,
            },
          });

          redirect(
            `/payment/checkout?bookingId=${booking.id}&amount=${totalPrice}&productName=${encodeURIComponent(product.name)}`
          );
        }}
        className="flex gap-3"
      >
        <input
          type="number"
          name="quantity"
          min="1"
          defaultValue="1"
          className="w-24 border rounded-xl px-3 py-3 text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          type="submit"
          className="flex-1 bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition font-semibold"
        >
          Buy Now
        </button>
      </form>
      <AddToCartButton productId={productId} />
    </div>
  );
}