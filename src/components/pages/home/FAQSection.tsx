"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is your delivery timeframe?",
    answer:
      "We deliver within 3-7 business days for Dhaka and 7-14 days for other cities across Bangladesh. Express delivery is available for an additional charge.",
  },
  {
    question: "Do you offer assembly services?",
    answer:
      "Yes! We offer professional assembly services for all furniture. Our trained team will set up your furniture at your home. Assembly charges vary by product.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy. If you're not satisfied with your purchase, contact our support team and we'll arrange a pickup and full refund.",
  },
  {
    question: "Are your products covered by warranty?",
    answer:
      "All BigBoom products come with a minimum 1-year warranty. Premium products carry a 5-year warranty covering manufacturing defects.",
  },
  {
    question: "Can I customize furniture colors or dimensions?",
    answer:
      "Yes, we offer customization for select products. Contact our sales team with your requirements and we'll provide a custom quote within 48 hours.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bKash, Nagad, Rocket, all major credit/debit cards, and cash on delivery for orders within Dhaka.",
  },
  {
    question: "Do you deliver outside Bangladesh?",
    answer:
      "Currently we only deliver within Bangladesh. We're working on expanding our delivery network internationally.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500">
            Have questions? We have answers. If you can't find what you're
            looking for, contact our support team.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-semibold text-gray-900 text-sm md:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === i && (
                <div className="px-6 pb-4">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}