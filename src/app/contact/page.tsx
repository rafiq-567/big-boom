"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
            Get in Touch
          </span>
          <h1 className="text-4xl font-bold mt-3 mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Have a question or need help? Our team is here for you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              {
                icon: MapPin,
                title: "Our Location",
                info: "123 Furniture Street, Gulshan-2, Dhaka 1212, Bangladesh",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Phone,
                title: "Phone Number",
                info: "+880 1700-123456\n+880 1800-654321",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: Mail,
                title: "Email Address",
                info: "hello@bigboom.com\nsupport@bigboom.com",
                color: "bg-yellow-50 text-yellow-600",
              },
              {
                icon: Clock,
                title: "Working Hours",
                info: "Mon - Fri: 9AM - 8PM\nSat - Sun: 10AM - 6PM",
                color: "bg-purple-50 text-purple-600",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-5 border flex gap-4"
              >
                <div
                  className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {item.title}
                  </p>
                  <p className="text-gray-500 text-sm whitespace-pre-line mt-0.5">
                    {item.info}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border p-8">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-500">
                  Thank you for reaching out. We'll get back to you within
                  24 hours.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      required
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}