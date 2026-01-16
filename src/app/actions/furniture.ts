// app/actions/furniture.ts
"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addFurniture(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const stock = parseInt(formData.get("stock") as string);

  try {
    await db.product.create({
      data: {
        name,
        description,
        price,
        category,
        stock,
        images: ["https://via.placeholder.com/300"], // আপাতত একটি ডামি ছবি
      },
    });

    revalidatePath("/shop"); // হোম পেজ বা যেখানে লিস্ট দেখাবেন সেখানে ডাটা আপডেট করবে
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}