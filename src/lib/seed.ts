import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // Admin user
  const adminPassword = await bcrypt.hash("123456", 10);
  await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Demo user
  const userPassword = await bcrypt.hash("123456", 10);
  const user = await db.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: userPassword,
      name: "Demo User",
      role: "CUSTOMER",
    },
  });

  // Get admin for createdById
  const admin = await db.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!admin) {
    console.log("Admin not found");
    return;
  }

  // Sample products
  const products = [
    {
      name: "Luxury Velvet Sofa",
      description: "A plush 3-seater velvet sofa with solid oak legs. Perfect for modern living rooms with superior comfort.",
      price: 899.99,
      category: "Sofa",
      stock: 15,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
      location: "Dhaka",
    },
    {
      name: "King Size Platform Bed",
      description: "Minimalist king size bed with upholstered headboard and under-bed storage for maximum utility.",
      price: 1299.99,
      category: "Bed",
      stock: 8,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
      location: "Chittagong",
    },
    {
      name: "Walnut Dining Table",
      description: "Solid walnut dining table seats 6. Timeless design with modern proportions for family dining.",
      price: 749.99,
      category: "Table",
      stock: 12,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=800"],
      location: "Dhaka",
    },
    {
      name: "Ergonomic Office Chair",
      description: "Fully adjustable ergonomic chair with lumbar support and breathable mesh back for all-day comfort.",
      price: 349.99,
      category: "Chair",
      stock: 25,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800"],
      location: "Sylhet",
    },
    {
      name: "Scandinavian Wardrobe",
      description: "4-door wardrobe with clean lines and smart interior organization system for modern bedrooms.",
      price: 999.99,
      category: "Wardrobe",
      stock: 6,
      isFeatured: false,
      images: ["https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800"],
      location: "Dhaka",
    },
    {
      name: "L-Shaped Corner Sofa",
      description: "Spacious L-shaped sofa perfect for family rooms. Premium fabric with deep cushioning.",
      price: 1199.99,
      category: "Sofa",
      stock: 10,
      isFeatured: false,
      images: ["https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800"],
      location: "Dhaka",
    },
    {
      name: "Mid-Century Coffee Table",
      description: "Iconic mid-century design with tapered legs and solid teak top. A statement piece for any room.",
      price: 299.99,
      category: "Table",
      stock: 20,
      isFeatured: false,
      images: ["https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=800"],
      location: "Chittagong",
    },
    {
      name: "Bunk Bed with Storage",
      description: "Twin-over-full bunk bed with built-in drawers and safety rails. Perfect for kids rooms.",
      price: 649.99,
      category: "Bed",
      stock: 7,
      isFeatured: false,
      images: ["https://images.unsplash.com/photo-1604872441539-ef1db9b25f92?w=800"],
      location: "Dhaka",
    },
  ];

  for (const p of products) {
    await db.product.create({
      data: { ...p, createdById: admin.id },
    });
  }

  // Sample reviews
  const allProducts = await db.product.findMany();
  const comments = [
    { rating: 5, comment: "Absolutely love this! Great quality and fast delivery." },
    { rating: 4, comment: "Very sturdy and looks exactly like the photo. Happy with it." },
    { rating: 5, comment: "Premium quality furniture. Worth every penny!" },
  ];

  for (const product of allProducts.slice(0, 4)) {
    for (const review of comments) {
      await db.review.create({
        data: {
          ...review,
          productId: product.id,
          userId: user.id,
        },
      });
    }
    await db.product.update({
      where: { id: product.id },
      data: { rating: 4.7 },
    });
  }

  // Sample bookings
  for (const product of allProducts.slice(0, 3)) {
    await db.booking.create({
      data: {
        userId: user.id,
        productId: product.id,
        quantity: 1,
        price: product.price,
        status: "confirmed",
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("👤 User:  user@example.com  / 123456");
  console.log("🛡️  Admin: admin@example.com / 123456");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());