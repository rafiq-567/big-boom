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

    const { bookingId, action } = await req.json();

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { product: true },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    if (action === "success") {
      // Confirm the booking
      await db.booking.update({
        where: { id: bookingId },
        data: { status: "confirmed" },
      });

      // Decrease stock
      await db.product.update({
        where: { id: booking.productId },
        data: { stock: { decrement: booking.quantity } },
      });

      return NextResponse.json({
        success: true,
        message: "Payment confirmed",
        data: { bookingId },
      });
    } else {
      // Cancel the booking
      await db.booking.update({
        where: { id: bookingId },
        data: { status: "cancelled" },
      });

      return NextResponse.json({
        success: true,
        message: "Payment cancelled",
        data: { bookingId },
      });
    }
  } catch (error) {
    console.error("Payment confirm error:", error);
    return NextResponse.json(
      { success: false, message: "Payment failed" },
      { status: 500 }
    );
  }
}