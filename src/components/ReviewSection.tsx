"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Trash2 } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

export default function ReviewSection({
  productId,
  reviews: initialReviews,
  session,
}: {
  productId: string;
  reviews: Review[];
  session: any;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, productId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to submit review");
        return;
      }

      setReviews([data.data, ...reviews]);
      setComment("");
      setRating(5);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
      }
    } catch {
      alert("Failed to delete review");
    }
  };

  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-8">
        Reviews ({reviews.length})
      </h2>

      {/* Write Review */}
      {session ? (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          {/* Star Rating */}
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="text-2xl transition-transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= (hovered || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500 self-center">
              {rating}/5
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            required
            placeholder="Share your experience..."
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-yellow-600 text-white px-6 py-2 rounded-xl hover:bg-yellow-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-center">
          <p className="text-gray-500">
            Please{" "}
            <a href="/login" className="text-yellow-600 font-semibold hover:underline">
              login
            </a>{" "}
            to write a review.
          </p>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border rounded-2xl p-5 flex gap-4"
            >
              {/* Avatar */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-yellow-100 flex-shrink-0">
                {review.user.avatar ? (
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-yellow-600 font-bold text-sm">
                    {review.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-semibold text-sm">
                      {review.user.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Delete button */}
                  {(userId === review.user.id || isAdmin) && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}