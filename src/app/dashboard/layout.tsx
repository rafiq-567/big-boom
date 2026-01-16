"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Add Furniture", href: "/dashboard/add-furniture" },
  { label: "Products", href: "/dashboard/products" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Users", href: "/dashboard/users" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-background md:block">
        <ScrollArea className="h-full">
          <div className="p-4 font-semibold text-lg">Admin</div>
          <Separator />
          <nav className="p-2 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <ScrollArea className="h-full">
            <div className="p-4 font-semibold text-lg">Admin</div>
            <Separator />
            <nav className="p-2 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
