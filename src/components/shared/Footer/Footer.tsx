import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold text-yellow-500">
              BigBoom
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Bangladesh's premier furniture destination. Premium quality,
              exceptional design, delivered to your door.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }) => (
                
                  key={href}
                  href={href}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-600 transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "Categories", href: "/categories" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-yellow-500 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {["Sofas", "Beds", "Tables", "Chairs", "Wardrobes", "Desks"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      href={`/shop?category=${cat.slice(0, -1)}`}
                      className="text-sm text-gray-400 hover:text-yellow-500 transition"
                    >
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                123 Furniture Street, Gulshan-2, Dhaka 1212
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                +880 1700-123456
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                hello@bigboom.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BigBoom. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-yellow-500 transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-yellow-500 transition"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}