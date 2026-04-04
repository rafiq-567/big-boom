"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Loader2, User } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user as any;

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update profile");
        return;
      }

      await update({ name });
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-yellow-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.name || "User"}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Form */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full border rounded-xl px-3 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="+880 1234 567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
              placeholder="Your delivery address"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-600 text-white py-2.5 rounded-xl hover:bg-yellow-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}