import Link from "next/link";
import { Users, Award, Truck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-6">
            About BigBoom
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Founded in 2018, BigBoom has grown from a small Dhaka-based
            workshop into Bangladesh's premier furniture destination. We believe
            that great furniture transforms not just spaces, but lives.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-3xl font-bold mt-2 mb-6">
                Making Beautiful Homes Accessible to Everyone
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                At BigBoom, we're on a mission to democratize interior design
                in Bangladesh. We believe every home deserves beautiful,
                high-quality furniture — regardless of budget.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Our team of designers and craftsmen work tirelessly to create
                furniture that combines aesthetic beauty with lasting
                durability, ensuring your investment stands the test of time.
              </p>
              <Link
                href="/shop"
                className="bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition font-semibold inline-block"
              >
                Explore Our Collection
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "1200+ Happy Customers", color: "bg-blue-50 text-blue-600" },
                { icon: Award, label: "Award Winning Design", color: "bg-yellow-50 text-yellow-600" },
                { icon: Truck, label: "Nationwide Delivery", color: "bg-green-50 text-green-600" },
                { icon: Heart, label: "Made with Love", color: "bg-red-50 text-red-600" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-2xl p-6 text-center">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm text-gray-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-4">
              Meet the People Behind BigBoom
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Rafiq Ahmed", role: "Founder & CEO", initial: "R" },
              { name: "Sultana Begum", role: "Head of Design", initial: "S" },
              { name: "Farhan Islam", role: "Operations Director", initial: "F" },
              { name: "Nadia Khan", role: "Customer Experience", initial: "N" },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 text-center border">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}