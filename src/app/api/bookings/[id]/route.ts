import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN")
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );

    const { status } = await req.json();
    const validStatuses = ["pending", "confirmed", "cancelled", "delivered"];

    if (!validStatuses.includes(status))
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );

    const booking = await db.booking.update({
      where: { id },
      data: { status },
      include: {
        product: { select: { id: true, name: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking updated",
      data: booking,
    });
  } catch (error) {
    console.error("PATCH booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const booking = await db.booking.findUnique({ where: { id } });
    if (!booking)
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );

    const sessionUser = session.user as any;
    if (booking.userId !== sessionUser.id && sessionUser.role !== "ADMIN")
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );

    await db.booking.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Booking deleted",
      data: null,
    });
  } catch (error) {
    console.error("DELETE booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete booking" },
      { status: 500 }
    );
  }
}