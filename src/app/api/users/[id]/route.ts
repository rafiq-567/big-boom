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
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true,
        role: true, avatar: true, phone: true,
        address: true, createdAt: true,
      },
    });

    if (!user)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "User fetched",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user" },
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
    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const sessionUser = session.user as any;
    const isAdmin = sessionUser?.role === "ADMIN";
    const isSelf = sessionUser?.id === id;

    if (!isAdmin && !isSelf)
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );

    const { name, phone, address, avatar, role } = await req.json();

    const user = await db.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(avatar !== undefined && { avatar }),
        ...(role !== undefined && isAdmin && { role }),
      },
      select: {
        id: true, name: true, email: true,
        role: true, avatar: true, phone: true, address: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User updated",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
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

    await db.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "User deleted",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}