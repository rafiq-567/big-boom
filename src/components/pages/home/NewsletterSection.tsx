"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
    setEmail("");
  };

  return (
    <section className="py-20 bg-yellow-600">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-7 h-7 text-white" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Stay in the Loop
        </h2>
        <p className="text-yellow-100 mb-8 max-w-xl mx-auto">
          Subscribe to our newsletter and get exclusive deals, new arrivals,
          and interior design tips delivered straight to your inbox.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-white bg-white/20 rounded-2xl px-6 py-4 max-w-md mx-auto">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">
              You're subscribed! Thank you.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition font-semibold text-sm disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        )}

        {error && (
          <p className="text-yellow-200 text-sm mt-3">{error}</p>
        )}

        <p className="text-yellow-200 text-xs mt-4">
          No spam ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}