import * as cheerio from "cheerio";

interface PageContent {
  url: string;
  title: string;
  content: string;
}

async function scrapePage(url: string): Promise<{ content: PageContent; links: string[] }> {
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

  // Extract internal links
  const baseUrl = new URL(url);
  const links: string[] = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (href) {
      try {
        const linkUrl = new URL(href, url);
        // Only include links from the same domain
        if (linkUrl.hostname === baseUrl.hostname) {
          const normalizedUrl = linkUrl.origin + linkUrl.pathname;
          if (!links.includes(normalizedUrl) && normalizedUrl !== url) {
            links.push(normalizedUrl);
          }
        }
      } catch {
        // Invalid URL, skip
      }
    }
  });

  // Remove non-content elements
  $("script, style, nav, footer, header, aside, [role='navigation'], [role='banner'], [aria-hidden='true']").remove();

  // Extract content
  const title = $("title").text().trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";
  const mainContent = $("main, article, [role='main'], .content, #content, .main")
    .first()
    .text()
    .trim();

  const bodyText = mainContent || $("body").text().trim();
  const cleanedText = bodyText.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();

  return {
    content: {
      url,
      title,
      content: `${title}\n${metaDescription}\n\n${cleanedText}`,
    },
    links: links.slice(0, 10), // Limit to 10 links
  };
}

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    const visited = new Set<string>();
    const pages: PageContent[] = [];
    const maxPages = 5; // Limit to 5 pages total
    const queue = [url];

    while (queue.length > 0 && pages.length < maxPages) {
      const currentUrl = queue.shift()!;

      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);

      try {
        const { content, links } = await scrapePage(currentUrl);
        pages.push(content);

        // Add new links to queue (prioritize About, Services, Products, Contact pages)
        const priorityLinks = links.filter(link =>
          /\/(about|services|products|contact|team|solutions)/i.test(link)
        );
        const otherLinks = links.filter(link =>
          !/\/(about|services|products|contact|team|solutions)/i.test(link)
        );

        queue.push(...priorityLinks, ...otherLinks);
      } catch (error) {
        console.error(`Failed to scrape ${currentUrl}:`, error);
      }
    }

    // Combine all pages into one context
    let combinedContent = `Website: ${new URL(url).hostname}\n\n`;

    pages.forEach((page, index) => {
      combinedContent += `\n--- Page ${index + 1}: ${page.title || page.url} ---\n`;
      combinedContent += page.content + "\n";
    });

    // Limit total length
    const maxLength = 20000;
    if (combinedContent.length > maxLength) {
      combinedContent = combinedContent.substring(0, maxLength) + "\n\n[Content truncated for length]";
    }

    return combinedContent.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to scrape website: ${error.message}`);
    }
    throw new Error("Failed to scrape website");
  }
}
