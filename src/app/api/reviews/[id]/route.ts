import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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

    const review = await db.review.findUnique({ where: { id } });
    if (!review)
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );

    const sessionUser = session.user as any;
    const isOwner = review.userId === sessionUser.id;
    const isAdmin = sessionUser.role === "ADMIN";

    if (!isOwner && !isAdmin)
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );

    await db.review.delete({ where: { id } });

    const reviews = await db.review.findMany({
      where: { productId: review.productId },
    });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    await db.product.update({
      where: { id: review.productId },
      data: { rating: parseFloat(avgRating.toFixed(1)) },
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted",
      data: null,
    });
  } catch (error) {
    console.error("DELETE review error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete review" },
      { status: 500 }
    );
  }
}