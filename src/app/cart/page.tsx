"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trash2, Minus, Plus, ShoppingBag, Loader2, ArrowLeft } from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
    category: string;
  };
}

interface CartData {
  items: CartItem[];
}

export default function CartPage() {
  const router = useRouter();
  const { status } = useSession();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data.data);
    } catch {
      console.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const updateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, quantity: newQty } : i
        ),
      };
    });
    await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    });
    fetchCart();
  };

  const removeItem = async (itemId: string) => {
    setCart((prev) => {
      if (!prev) return prev;
      return { ...prev, items: prev.items.filter((i) => i.id !== itemId) };
    });
    await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    fetchCart();
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/cart/checkout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        router.push(
          `/payment/checkout?bookingId=${data.data.bookingId}&amount=${data.data.amount}&productName=${encodeURIComponent(data.data.productName)}`
        );
      } else {
        alert(data.message || "Checkout failed");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to View Cart</h2>
          <p className="text-gray-500 mb-6">Please sign in to see your cart items.</p>
          <Link
            href="/login"
            className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/shop" className="text-gray-400 hover:text-gray-600 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Browse our collection and add items you love.</p>
            <Link
              href="/shop"
              className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border p-4 flex gap-4 items-center"
              >
                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.product.id}`}>
                    <h3 className="font-semibold text-gray-900 truncate hover:text-yellow-600 transition">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-400">{item.product.category}</p>
                  <p className="text-yellow-600 font-bold mt-1">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="bg-white rounded-2xl border p-5 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-400">({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold mb-6">
                <span>Total</span>
                <span className="text-yellow-600">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {checkingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Proceed to Checkout
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
