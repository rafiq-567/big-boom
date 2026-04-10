import { Truck, Shield, RefreshCw, Headphones, Award, CreditCard } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free shipping on all orders above $500. Fast and reliable delivery to your doorstep.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "All our furniture is crafted from premium materials with a 5-year warranty.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Not satisfied? Return within 30 days for a full refund, no questions asked.",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer support team is available around the clock to help you.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized as Bangladesh's best furniture brand for 3 consecutive years.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Multiple secure payment options including bKash, Nagad, and all major cards.",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            The BigBoom Difference
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We go beyond just selling furniture. We provide an exceptional
            experience from browsing to delivery and beyond.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}