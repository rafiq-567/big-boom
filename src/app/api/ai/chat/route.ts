import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message)
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful assistant for BigBoom, a premium furniture e-commerce store in Bangladesh.
Help users with furniture recommendations, room decoration tips, style advice, material questions, and shopping guidance.
Be concise, friendly, and helpful. Keep responses under 150 words.
If asked anything unrelated to furniture or home decor, politely redirect to furniture topics.

User: ${message}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({
      success: true,
      message: "AI response generated",
      data: { reply },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { success: false, message: "AI service unavailable" },
      { status: 500 }
    );
  }
}