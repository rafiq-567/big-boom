import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await db.product.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reviews: true, bookings: true } },
      },
    });

    if (!item)
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "Product fetched",
      data: item,
    });
  } catch (error) {
    console.error("GET item error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

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

    const body = await req.json();

    const item = await db.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.images && { images: body.images }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.category && { category: body.category }),
        ...(body.stock !== undefined && { stock: parseInt(body.stock) }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated",
      data: item,
    });
  } catch (error) {
    console.error("PATCH item error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
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

    if (!session || (session.user as any)?.role !== "ADMIN")
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );

    await db.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Product deleted",
      data: null,
    });
  } catch (error) {
    console.error("DELETE item error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}