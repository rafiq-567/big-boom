import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const socials = [
  { label: "Facebook", icon: Facebook },
  { label: "Instagram", icon: Instagram },
  { label: "Twitter", icon: Twitter },
  { label: "Youtube", icon: Youtube },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const shopCategories = [
  { label: "Sofas", href: "/shop?category=Sofa" },
  { label: "Beds", href: "/shop?category=Bed" },
  { label: "Tables", href: "/shop?category=Table" },
  { label: "Chairs", href: "/shop?category=Chair" },
  { label: "Wardrobes", href: "/shop?category=Wardrobe" },
  { label: "Desks", href: "/shop?category=Desk" },
];

const contactInfo = [
  { icon: MapPin, text: "123 Furniture Street, Gulshan-2, Dhaka 1212" },
  { icon: Phone, text: "+880 1700-123456" },
  { icon: Mail, text: "hello@bigboom.com" },
];

function SocialIcon({ label, icon: Icon }: { label: string; icon: any }) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-600 transition"
    >
      <Icon className="w-4 h-4" />
    </Link>
  );
}

function ContactItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <li className="flex gap-3 text-sm text-gray-400">
      <Icon className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
      <span>{text}</span>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
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
              {socials.map((s) => (
                <SocialIcon key={s.label} label={s.label} icon={s.icon} />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
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
              {shopCategories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-sm text-gray-400 hover:text-yellow-500 transition"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((item) => (
                <ContactItem key={item.text} icon={item.icon} text={item.text} />
              ))}
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