import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(_req: NextRequest) {
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
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`,
        }, { status: 400 });
      }
    }

    const bookings = [];
    for (const item of cart.items) {
      const booking = await db.booking.create({
        data: {
          userId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price * item.quantity,
          status: "pending",
          transactionId: `TXN-${Date.now()}-${item.id}`,
        },
      });
      bookings.push(booking);
    }

    await db.cartItem.deleteMany({ where: { cartId: cart.id } });

    const firstBooking = bookings[0];
    const totalAmount = bookings.reduce((sum, b) => sum + b.price, 0);
    const productNames = cart.items.map((i) => i.product.name).join(", ");

    return NextResponse.json({
      success: true,
      message: "Checkout successful",
      data: {
        bookingId: firstBooking.id,
        amount: totalAmount,
        productName: productNames,
      },
    });
  } catch (error) {
    console.error("Cart checkout error:", error);
    return NextResponse.json({ success: false, message: "Checkout failed" }, { status: 500 });
  }
}
