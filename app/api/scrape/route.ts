import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/scraper";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const content = await scrapeWebsite(url);

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to scrape website" },
      { status: 500 }
    );
  }
}
