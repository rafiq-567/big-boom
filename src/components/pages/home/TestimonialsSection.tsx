"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Rahima Begum",
    role: "Interior Designer",
    avatar: "R",
    rating: 5,
    text: "BigBoom has completely transformed how I source furniture for my clients. The quality is outstanding and delivery is always on time. Highly recommend!",
    location: "Dhaka",
  },
  {
    name: "Karim Hassan",
    role: "Homeowner",
    avatar: "K",
    rating: 5,
    text: "I ordered a king-size bed and a wardrobe. Both arrived perfectly packed and look exactly like the photos. The assembly service was a bonus!",
    location: "Chittagong",
  },
  {
    name: "Priya Sharma",
    role: "Office Manager",
    avatar: "P",
    rating: 5,
    text: "We furnished our entire office with BigBoom products. Professional look, great durability, and the customer support team was incredibly helpful.",
    location: "Sylhet",
  },
  {
    name: "Mohammad Ali",
    role: "Restaurant Owner",
    avatar: "M",
    rating: 4,
    text: "Ordered dining tables and chairs for my restaurant. Excellent craftsmanship and the prices are very competitive compared to other stores.",
    location: "Dhaka",
  },
  {
    name: "Nusrat Jahan",
    role: "Architect",
    avatar: "N",
    rating: 5,
    text: "As an architect, I'm very particular about furniture quality. BigBoom consistently delivers premium pieces that my clients absolutely love.",
    location: "Rajshahi",
  },
  {
    name: "Tanvir Ahmed",
    role: "Homeowner",
    avatar: "T",
    rating: 5,
    text: "The AI chatbot helped me pick the perfect sofa for my living room. Amazing technology and even better furniture. Will definitely order again!",
    location: "Dhaka",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const visible = testimonials.slice(
    current * itemsPerPage,
    current * itemsPerPage + itemsPerPage
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers think
            about their BigBoom experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visible.map((t, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= t.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrent((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            className="p-2 rounded-full border hover:bg-gray-50 transition disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === current ? "bg-yellow-600 w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setCurrent((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={current === totalPages - 1}
            className="p-2 rounded-full border hover:bg-gray-50 transition disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}