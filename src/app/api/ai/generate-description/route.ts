import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { name, category, price } = await req.json();
    if (!name)
      return NextResponse.json(
        { success: false, message: "Product name is required" },
        { status: 400 }
      );

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Write a compelling 2-3 sentence product description for a furniture item.
Product Name: ${name}
Category: ${category || "furniture"}
Price: $${price || "not specified"}

Requirements:
- Highlight quality, craftsmanship, and design
- Mention practical benefits
- Sound premium and appealing
- Keep it under 80 words
- No bullet points, just flowing prose`;

    const result = await model.generateContent(prompt);
    const description = result.response.text();

    return NextResponse.json({
      success: true,
      message: "Description generated",
      data: { description },
    });
  } catch (error) {
    console.error("AI description error:", error);
    return NextResponse.json(
      { success: false, message: "AI service unavailable" },
      { status: 500 }
    );
  }
}