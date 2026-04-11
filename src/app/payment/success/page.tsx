import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { db } from "@/lib/db";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;

  const booking = bookingId
    ? await db.booking.findUnique({
        where: { id: bookingId },
        include: {
          product: { select: { name: true, images: true } },
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-6">
          Your order has been confirmed. Thank you for shopping with BigBoom!
        </p>

        {booking && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-1">Order Details</p>
            <p className="font-semibold">{booking.product.name}</p>
            <p className="text-sm text-gray-500">
              Quantity: {booking.quantity}
            </p>
            <p className="text-sm font-semibold text-yellow-600 mt-1">
              Total: ${booking.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Status:{" "}
              <span className="text-green-600 font-medium">
                {booking.status}
              </span>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/my-orders"
            className="bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition font-semibold"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="border py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}