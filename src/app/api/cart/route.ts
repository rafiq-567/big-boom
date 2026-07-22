import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

async function getOrCreateCart(userId: string) {
  let cart = await db.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await db.cart.create({ data: { userId } });
  }
  return cart;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, images: true, stock: true, category: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: cart ?? { items: [] },
    });
  } catch (error) {
    console.error("GET cart error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json({ success: false, message: "productId and quantity are required" }, { status: 400 });
    }

    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const cart = await getOrCreateCart(userId);

    const existing = await db.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existing) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + parseInt(quantity) },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: parseInt(quantity),
        },
      });
    }

    return NextResponse.json({ success: true, message: "Added to cart" }, { status: 201 });
  } catch (error) {
    console.error("POST cart error:", error);
    return NextResponse.json({ success: false, message: "Failed to add to cart" }, { status: 500 });
  }
}
