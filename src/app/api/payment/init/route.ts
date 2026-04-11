import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await req.json();
    const sessionUser = session.user as any;

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: "Insufficient stock" },
        { status: 400 }
      );
    }

    const totalPrice = product.price * quantity;
    const transactionId = `TXN-${Date.now()}`;

    // Create pending booking
    const booking = await db.booking.create({
      data: {
        userId: sessionUser.id,
        productId,
        quantity: parseInt(quantity),
        price: totalPrice,
        status: "pending",
        transactionId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment initiated",
      data: {
        bookingId: booking.id,
        transactionId,
        amount: totalPrice,
        productName: product.name,
      },
    });
  } catch (error) {
    console.error("Payment init error:", error);
    return NextResponse.json(
      { success: false, message: "Payment service unavailable" },
      { status: 500 }
    );
  }
}