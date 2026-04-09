import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { reviews } = await req.json();
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0)
      return NextResponse.json(
        { success: false, message: "Reviews array is required" },
        { status: 400 }
      );

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const reviewText = reviews
      .map(
        (r: { rating: number; comment: string }) =>
          `Rating: ${r.rating}/5 - "${r.comment}"`
      )
      .join("\n");

    const prompt = `Analyze these customer reviews and provide a brief summary.
    
Reviews:
${reviewText}

Write 2-3 sentences covering:
1. Overall customer sentiment
2. What customers love most
3. Any common concerns (if any)

Be honest and balanced. Keep it under 80 words.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({
      success: true,
      message: "Summary generated",
      data: { summary },
    });
  } catch (error) {
    console.error("AI summary error:", error);
    return NextResponse.json(
      { success: false, message: "AI service unavailable" },
      { status: 500 }
    );
  }
}