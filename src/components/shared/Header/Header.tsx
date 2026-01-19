"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHomePage && !scrolled;

  const menuItems = [
    { title: "Home", url: "/" },
    { title: "Shop", url: "/shop" },
    { title: "Categories", url: "/categories" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" },
  ];

  const cartItemsCount = 0;
  const isAuthenticated = !!session;
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        isTransparent
          ? "bg-transparent text-white border-white/20"
          : "bg-white/95 backdrop-blur border-gray-200"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl md:text-3xl font-bold ${
            isTransparent ? "text-white" : "text-yellow-600"
          }`}
        >
          BigBoom
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`transition-colors ${
                  isActive
                    ? "text-yellow-600 font-semibold"
                    : isTransparent
                    ? "text-white hover:text-yellow-400"
                    : "hover:text-yellow-600"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link
            href="/cart"
            className={`relative transition-colors ${
              isTransparent ? "hover:text-yellow-400" : "hover:text-yellow-600"
            }`}
          >
            <ShoppingCart size={24} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* Auth Section */}
          {status !== "loading" && (
            <>
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className={`hidden md:block px-4 py-2 rounded-md transition-colors ${
                    isTransparent
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-yellow-600 text-white hover:bg-yellow-700"
                  }`}
                >
                  Login
                </Link>
              )}
              {!isAuthenticated && (
                <Link
                  href="/signup"
                  className={`hidden md:block px-4 py-2 rounded-md transition-colors ${
                    isTransparent
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-yellow-600 text-white hover:bg-yellow-700"
                  }`}
                >
                  Signup
                </Link>
              )}

              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-4">
                  {isAuthenticated && (
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-2 transition-colors ${
                        isTransparent
                          ? "hover:text-yellow-400"
                          : "hover:text-yellow-600"
                      }`}
                    >
                      <User size={22} />
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-amber-300 hover:text-red-700"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t ${
            isTransparent
              ? "bg-black/90 border-white/20"
              : "bg-white border-gray-200"
          }`}
        >
          <nav className="flex flex-col px-4 py-4 gap-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 ${
                    isActive ? "text-yellow-600 font-semibold" : ""
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}

            <div className="border-t pt-4 mt-2">
              {!isAuthenticated && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2 bg-yellow-600 text-white rounded-md"
                >
                  Login
                </Link>
              )}

              {isAuthenticated && (
                <>
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2"
                    >
                      <User size={20} />
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-2 py-2 text-yellow-300 w-full"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;