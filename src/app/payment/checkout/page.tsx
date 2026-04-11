"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CreditCard, Lock, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const amount = searchParams.get("amount");
  const productName = searchParams.get("productName");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/(.{2})/, "$1/");
  };

  const handlePayment = async (success: boolean) => {
    setLoading(true);

    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          action: success ? "success" : "cancel",
        }),
      });

      const data = await res.json();

      if (data.success && success) {
        router.push(`/payment/success?bookingId=${bookingId}`);
      } else {
        router.push(`/payment/fail?bookingId=${bookingId}`);
      }
    } catch {
      router.push("/payment/fail");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId) {
    router.push("/shop");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Complete Payment
          </h1>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{productName}</span>
            <span className="font-semibold">${Number(amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Delivery</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-yellow-600">
              ${Number(amount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="bg-white rounded-2xl border p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { id: "card", label: "Card" },
              { id: "bkash", label: "bKash" },
              { id: "nagad", label: "Nagad" },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`py-2.5 rounded-xl text-sm font-medium border-2 transition ${
                  paymentMethod === method.id
                    ? "border-yellow-600 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          {/* Card Form */}
          {paymentMethod === "card" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    placeholder="4111 1111 1111 1111"
                    maxLength={19}
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(formatExpiry(e.target.value))
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    placeholder="123"
                    maxLength={3}
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* bKash Form */}
          {paymentMethod === "bkash" && (
            <div className="space-y-3">
              <div className="bg-pink-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  bK
                </div>
                <div>
                  <p className="font-semibold text-pink-700">bKash Payment</p>
                  <p className="text-xs text-pink-500">
                    Demo mode — no real transaction
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  bKash Number
                </label>
                <input
                  placeholder="01XXXXXXXXX"
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          )}

          {/* Nagad Form */}
          {paymentMethod === "nagad" && (
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  N
                </div>
                <div>
                  <p className="font-semibold text-orange-700">
                    Nagad Payment
                  </p>
                  <p className="text-xs text-orange-500">
                    Demo mode — no real transaction
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nagad Number
                </label>
                <input
                  placeholder="01XXXXXXXXX"
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-center">
          <p className="text-xs text-blue-600">
            🔧 Demo Mode — Use any details to test the payment flow
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={() => handlePayment(true)}
          disabled={loading}
          className="w-full bg-yellow-600 text-white py-4 rounded-xl hover:bg-yellow-700 transition font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Pay ${Number(amount).toFixed(2)}
            </>
          )}
        </button>

        {/* Cancel Button */}
        <button
          onClick={() => handlePayment(false)}
          disabled={loading}
          className="w-full border py-3 rounded-xl hover:bg-gray-50 transition text-gray-600 font-medium disabled:opacity-50"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
}