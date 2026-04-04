
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  PlusCircle, User, LogOut, Menu, X,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = session?.user as any;
  const isAdmin = user?.role === "ADMIN";

  const adminLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Products", icon: Package },
    { href: "/dashboard/add-furniture", label: "Add Product", icon: PlusCircle },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const userLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/my-orders", label: "My Orders", icon: ShoppingBag },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b">
        <Link href="/" className="text-xl font-bold text-yellow-600">
          BigBoom
        </Link>
        <p className="text-xs text-gray-400 mt-1">
          {isAdmin ? "Admin Panel" : "My Account"}
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? "bg-yellow-50 text-yellow-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r fixed h-full z-20">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top bar */}
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3 md:hidden sticky top-0 z-10">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold">Dashboard</span>
        </div>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}