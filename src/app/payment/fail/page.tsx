import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-500 mb-8">
          Something went wrong with your payment. Please try again or
          contact support.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/shop"
            className="bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition font-semibold"
          >
            Back to Shop
          </Link>
          <Link
            href="/contact"
            className="border py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}