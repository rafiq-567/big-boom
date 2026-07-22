import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { quantity } = await req.json();

    const item = await db.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: { select: { userId: true } } },
    });

    if (!item || item.cart.userId !== userId) {
      return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
    }

    if (quantity < 1) {
      await db.cartItem.delete({ where: { id: itemId } });
      return NextResponse.json({ success: true, message: "Item removed" });
    }

    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json({ success: true, message: "Quantity updated" });
  } catch (error) {
    console.error("PATCH cart item error:", error);
    return NextResponse.json({ success: false, message: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const item = await db.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: { select: { userId: true } } },
    });

    if (!item || item.cart.userId !== userId) {
      return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
    }

    await db.cartItem.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true, message: "Item removed" });
  } catch (error) {
    console.error("DELETE cart item error:", error);
    return NextResponse.json({ success: false, message: "Failed to remove item" }, { status: 500 });
  }
}
