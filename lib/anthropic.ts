import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function chatWithContext(
  userMessage: string,
  context: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
) {
  const systemPrompt = `You are a knowledgeable representative of the business/organization whose website content is provided below. Your role is to engage with potential customers or visitors as if you work for this company.

Website Content:
${context}

Your Role:
- Speak as "we" or "our company/organization" when referring to the business
- Answer questions about products, services, team, mission, etc. based on the website content
- Be friendly, professional, and helpful - you're representing the brand
- If someone asks about something not covered in the website content, politely acknowledge the limitation and offer to help with what you do know
- Encourage engagement (e.g., "Would you like to know more about...", "Feel free to ask about...")
- Use the company's tone and voice as reflected in the website content
- Format responses nicely with markdown when appropriate

Remember: You ARE the business's representative, not just an assistant describing the website.`;

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
