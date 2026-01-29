import { NextRequest, NextResponse } from "next/server";
import { chatWithContext } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const { message, context, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!context) {
      return NextResponse.json(
        { error: "No website context provided. Please scrape a website first." },
        { status: 400 }
      );
    }

    const response = await chatWithContext(
      message,
      context,
      history || []
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate response" },
      { status: 500 }
    );
  }
}
