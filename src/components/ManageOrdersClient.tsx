"use client";

import { useState } from "react";

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "delivered"];

export default function ManageOrdersClient({ bookings: initial }: { bookings: any[] }) {
  const [bookings, setBookings] = useState(initial);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (res.ok) setBookings(bookings.filter((b) => b.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  No orders yet
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium">{booking.user.name || "—"}</p>
                    <p className="text-xs text-gray-400">{booking.user.email}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[150px] truncate">
                    {booking.product.name}
                  </td>
                  <td className="px-4 py-3">{booking.quantity}</td>
                  <td className="px-4 py-3 font-semibold">
                    ${booking.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      disabled={updating === booking.id}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}