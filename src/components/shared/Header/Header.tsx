// "use client"
// import Link from 'next/link'
// import { usePathname } from 'next/navigation';
// import React, { useEffect, useState } from 'react'
// import { ShoppingCart, User, Menu, X } from 'lucide-react'
// import { signOut, useSession } from "next-auth/react";

// const Header = () => {
//      const { data: session } = useSession();
//     // ১. সব হুকগুলো আগে ঘোষণা করুন (একদম শুরুতে)
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const [isMounted, setIsMounted] = useState(false);
//     const pathname = usePathname(); // হুকটি উপরে নিয়ে আসা হয়েছে
     

//     useEffect(() => {
//         setIsMounted(true);
//     }, []);

//     const menuItems = [
//         { title: "Home", url: "/" },
//         { title: "Shop", url: "/shop" },
//         { title: "Categories", url: "/categories" },
//         { title: "About", url: "/about" },
//         { title: "Contact", url: "/contact" }
//     ]
    
//     const cartItemsCount = 0;
//     const isAuthenticated = false;

//     // ২. Hydration Error এবং Hook Error এড়াতে আর্লি রিটার্ন না করে 
//     // কন্ডিশনাল রেন্ডারিং ব্যবহার করা ভালো।
//     // আমরা শুধু 'Active Link' এর কালারটুকু মাউন্ট হওয়ার পর দেখাব।

//     return (
//         <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
//             <div className='container mx-auto flex justify-between items-center px-4 md:px-8 py-4'>
                
//                 {/* Logo */}
//                 <Link href="/" className='text-2xl md:text-3xl font-bold text-yellow-600'>
//                     BigBoom
//                 </Link>
                
//                 {/* Desktop Navigation */}
//                 <nav className='hidden md:flex items-center gap-6'>
//                     {menuItems.map((item) => {
//                         // মাউন্ট হওয়ার আগে কালার চেক হবে না (Hydration Fix)
//                         const isActive = isMounted && pathname === item.url;
                        
//                         return (
//                             <Link 
//                                 href={item.url} 
//                                 key={item.url} 
//                                 className={`transition-colors hover:text-yellow-600 ${
//                                     isActive ? "text-yellow-600 font-semibold" : "text-foreground"
//                                 }`}
//                             >
//                                 {item.title}
//                             </Link>
//                         );
//                     })}
//                 </nav>
                
//                 {/* Right Side - Cart & Auth */}
//                 <div className='flex items-center gap-4'>
//                     <Link href="/cart" className='relative hover:text-yellow-600 transition-colors'>
//                         <ShoppingCart size={24} />
//                         {cartItemsCount > 0 && (
//                             <span className='absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
//                                 {cartItemsCount}
//                             </span>
//                         )}
//                     </Link>
                    
//                     {isAuthenticated ? (
//                         <Link href="/dashboard" className='hidden md:flex items-center gap-2 hover:text-yellow-600 transition-colors'>
//                             <User size={24} />
//                             <span>Dashboard</span>
//                         </Link>
//                     ) : (
//                         <Link href="/login" className='hidden md:block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors'>
//                             Login
//                         </Link>
//                     )}
                    
//                     <button className='md:hidden' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//                         {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//                     </button>
//                 </div>
//             </div>
            
//             {/* Mobile Menu */}
//             {mobileMenuOpen && (
//                 <div className='md:hidden border-t bg-background'>
//                     <nav className='flex flex-col px-4 py-4 gap-4'>
//                         {menuItems.map((item) => {
//                             const isActive = isMounted && pathname === item.url;
//                             return (
//                                 <Link 
//                                     href={item.url} 
//                                     key={item.url}
//                                     onClick={() => setMobileMenuOpen(false)}
//                                     className={`py-2 transition-colors ${
//                                         isActive ? "text-yellow-600 font-semibold" : ""
//                                     }`}
//                                 >
//                                     {item.title}
//                                 </Link>
//                             );
//                         })}
//                     </nav>
//                 </div>
//             )}
//         </header>
//     )
// }

// export default Header;


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-bold text-yellow-600">
          BigBoom
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive = isMounted && pathname === item.url;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`transition-colors hover:text-yellow-600 ${
                  isActive ? "text-yellow-600 font-semibold" : ""
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
          <Link href="/cart" className="relative hover:text-yellow-600">
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
                  className="hidden md:block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Login
                </Link>
              )}

              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-4">
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 hover:text-yellow-600"
                    >
                      <User size={22} />
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
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
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {menuItems.map((item) => {
              const isActive = isMounted && pathname === item.url;
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

            {!isAuthenticated && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-yellow-600 font-semibold"
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
                    className="py-2"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="py-2 text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
