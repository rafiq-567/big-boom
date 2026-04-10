import Hero from "@/components/pages/home/hero";
import FeaturesSection from "@/components/pages/home/FeaturesSection";
import CategoriesSection from "@/components/pages/home/CategoriesSection";
import FeaturedProducts from "@/components/pages/home/FeaturedProducts";
import StatsSection from "@/components/pages/home/StatsSection";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection";
import FAQSection from "@/components/pages/home/FAQSection";
import NewsletterSection from "@/components/pages/home/NewsletterSection";
import CTASection from "@/components/pages/home/CTASection";
import { db } from "@/lib/db";

export default async function Home() {
  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const allProducts = await db.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const [totalUsers, totalProducts, totalOrders] = await Promise.all([
    db.user.count(),
    db.product.count(),
    db.booking.count(),
  ]);

  const products = featuredProducts.length > 0 ? featuredProducts : allProducts;

  return (
    <main>
      <Hero />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedProducts products={products} />
      <StatsSection
        totalUsers={totalUsers}
        totalProducts={totalProducts}
        totalOrders={totalOrders}
      />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
      <NewsletterSection />
    </main>
  );
}