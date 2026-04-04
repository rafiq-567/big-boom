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

    const { rating, comment, productId } = await req.json();

    if (!rating || !comment || !productId)
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );

    const review = await db.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        productId,
        userId: (session.user as any).id,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Recalculate average rating
    const reviews = await db.review.findMany({ where: { productId } });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await db.product.update({
      where: { id: productId },
      data: { rating: parseFloat(avgRating.toFixed(1)) },
    });

    return NextResponse.json(
      { success: true, message: "Review created", data: review },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST review error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create review" },
      { status: 500 }
    );
  }
}