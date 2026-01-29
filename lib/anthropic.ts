import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function chatWithContext(
  userMessage: string,
  context: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
) {
  const systemPrompt = `You are a helpful assistant that answers questions about a website. You have been provided with the content of the website below. Answer questions based on this content. If the information isn't available in the website content, say so politely.

Website Content:
${context}

Instructions:
- Be concise and helpful
- Only use information from the provided website content
- If asked about something not in the content, acknowledge that
- Format responses nicely with markdown when appropriate`;

  const messages = [
    ...conversationHistory,
    { role: "user" as const, content: userMessage },
  ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages,
  });

  const textContent = response.content.find((block) => block.type === "text");
  return textContent ? textContent.text : "I couldn't generate a response.";
}

export default anthropic;
