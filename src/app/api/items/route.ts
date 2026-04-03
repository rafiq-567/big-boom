import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const rating = searchParams.get("rating");
    const sort = searchParams.get("sort") || "-createdAt";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) (where.price as any).gte = parseFloat(priceMin);
      if (priceMax) (where.price as any).lte = parseFloat(priceMax);
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith("-") ? "desc" : "asc";
    const orderBy = { [sortField]: sortOrder } as any;

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          _count: { select: { reviews: true } },
        },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Items fetched",
      data: { data: items, meta: { page, limit, total } },
    });
  } catch (error) {
    console.error("GET items error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admins only." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, images, price, location, category, stock, isFeatured } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, message: "Name, description, price and category are required" },
        { status: 400 }
      );
    }

    const item = await db.product.create({
      data: {
        name,
        description,
        images: images || [],
        price: parseFloat(price),
        location: location || "",
        category,
        stock: parseInt(stock) || 0,
        isFeatured: isFeatured || false,
        createdById: (session.user as any).id,
      },
    });

    return NextResponse.json(
      { success: true, message: "Product created successfully", data: item },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST item error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}