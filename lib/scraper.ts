import * as cheerio from "cheerio";

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, and other non-content elements
    $("script, style, nav, footer, header, aside, [role='navigation'], [role='banner'], [aria-hidden='true']").remove();

    // Extract meaningful content
    const title = $("title").text().trim();
    const metaDescription = $('meta[name="description"]').attr("content") || "";

    // Get main content areas
    const mainContent = $("main, article, [role='main'], .content, #content, .main")
      .first()
      .text()
      .trim();

    // If no main content found, get body text
    const bodyText = mainContent || $("body").text().trim();

    // Clean up whitespace
    const cleanedText = bodyText
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .trim();

    // Limit content length to avoid token limits
    const maxLength = 8000;
    const truncatedText = cleanedText.length > maxLength
      ? cleanedText.substring(0, maxLength) + "..."
      : cleanedText;

    return `
Title: ${title}
Description: ${metaDescription}

Content:
${truncatedText}
    `.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to scrape website: ${error.message}`);
    }
    throw new Error("Failed to scrape website");
  }
}
