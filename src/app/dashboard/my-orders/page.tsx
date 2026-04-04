import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const bookings = await db.booking.findMany({
    where: { userId: (session.user as any).id },
    include: {
      product: {
        select: { id: true, name: true, images: true, price: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <p className="text-gray-400 mb-4">You have no orders yet.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block bg-yellow-600 text-white px-6 py-2 rounded-xl hover:bg-yellow-700"
          >
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {booking.product.images?.[0] ? (
                  <img
                    src={booking.product.images[0]}
                    alt={booking.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-lg">{booking.product.name}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {booking.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  Ordered: {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-yellow-600 mb-2">
                  ${booking.price.toFixed(2)}
                </p>
                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                    booking.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "confirmed"
                      ? "bg-blue-100 text-blue-700"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}