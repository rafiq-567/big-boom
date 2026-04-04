import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DashboardCharts from "@/components/DashboardCharts";
import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as any;
  const isAdmin = user.role === "ADMIN";

  if (isAdmin) {
    const [totalUsers, totalProducts, bookings] = await Promise.all([
      db.user.count(),
      db.product.count(),
      db.booking.findMany({
        select: { price: true, status: true, createdAt: true },
      }),
    ]);

    const totalOrders = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);

    const stats = [
      {
        label: "Total Users",
        value: totalUsers,
        icon: Users,
        color: "bg-blue-500",
      },
      {
        label: "Total Products",
        value: totalProducts,
        icon: Package,
        color: "bg-green-500",
      },
      {
        label: "Total Orders",
        value: totalOrders,
        icon: ShoppingBag,
        color: "bg-yellow-500",
      },
      {
        label: "Total Revenue",
        value: `$${totalRevenue.toFixed(2)}`,
        icon: DollarSign,
        color: "bg-purple-500",
      },
    ];

    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm border"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <DashboardCharts bookings={bookings} />
      </div>
    );
  }

  // Regular user dashboard
  const userBookings = await db.booking.findMany({
    where: { userId: user.id },
    include: {
      product: {
        select: { name: true, images: true, price: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Welcome back, {user.name || user.email}!
      </h1>
      <p className="text-gray-500 mb-8">Here are your recent orders.</p>

      {userBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders yet.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block bg-yellow-600 text-white px-6 py-2 rounded-xl hover:bg-yellow-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {userBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {booking.product.images?.[0] ? (
                  <img
                    src={booking.product.images[0]}
                    alt={booking.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No img
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold">{booking.product.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {booking.quantity} · ${booking.price.toFixed(2)}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  booking.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "confirmed"
                    ? "bg-blue-100 text-blue-700"
                    : booking.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {booking.status}
              </span>
            </div>
          ))}

          <Link
            href="/dashboard/my-orders"
            className="block text-center text-sm text-yellow-600 hover:underline pt-2"
          >
            View all orders
          </Link>
        </div>
      )}
    </div>
  );
}