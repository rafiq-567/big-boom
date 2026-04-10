"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Package, ShoppingBag, Star } from "lucide-react";

function CountUp({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const timer = setInterval(() => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress === 1) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function StatsSection({
  totalUsers,
  totalProducts,
  totalOrders,
}: {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
}) {
  const stats = [
    {
      icon: Users,
      value: totalUsers || 1200,
      suffix: "+",
      label: "Happy Customers",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Package,
      value: totalProducts || 430,
      suffix: "+",
      label: "Products Available",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      icon: ShoppingBag,
      value: totalOrders || 850,
      suffix: "+",
      label: "Orders Delivered",
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      icon: Star,
      value: 98,
      suffix: "%",
      label: "Satisfaction Rate",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
            Our Numbers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our numbers speak for themselves. Join thousands of satisfied
            customers who have transformed their homes with BigBoom.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <div
                className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold mb-1">
                <CountUp end={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}