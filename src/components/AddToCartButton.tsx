"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch {
      alert("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="flex-1 border-2 border-yellow-600 text-yellow-600 py-3 rounded-xl hover:bg-yellow-50 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      Add to Cart
    </button>
  );
}
