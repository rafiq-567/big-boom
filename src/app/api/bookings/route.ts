import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { productId, quantity } = await req.json();

    if (!productId || !quantity)
      return NextResponse.json(
        { success: false, message: "productId and quantity are required" },
        { status: 400 }
      );

    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product)
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );

    if (product.stock < quantity)
      return NextResponse.json(
        { success: false, message: "Insufficient stock" },
        { status: 400 }
      );

    const booking = await db.booking.create({
      data: {
        userId: (session.user as any).id,
        productId,
        quantity: parseInt(quantity),
        price: product.price * parseInt(quantity),
        status: "pending",
      },
      include: {
        product: { select: { id: true, name: true, images: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await db.product.update({
      where: { id: productId },
      data: { stock: { decrement: parseInt(quantity) } },
    });

    return NextResponse.json(
      { success: true, message: "Booking created", data: booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const sessionUser = session.user as any;
    const isAdmin = sessionUser.role === "ADMIN";

    const bookings = await db.booking.findMany({
      where: isAdmin ? {} : { userId: sessionUser.id },
      include: {
        product: { select: { id: true, name: true, images: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Bookings fetched",
      data: bookings,
    });
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}