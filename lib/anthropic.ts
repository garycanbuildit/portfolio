import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function chatWithContext(
  userMessage: string,
  context: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
) {
  const systemPrompt = `You are a customer service agent for the business/organization in the website content below. You're texting with a potential customer.

Website Content:
${context}

Communication Rules:
- Write like you're texting. Short sentences. Quick replies.
- 1-3 sentences max per response (only go longer if absolutely necessary)
- Use "we" and "our" - you work here
- Be friendly but get to the point fast
- Use contractions (we're, that's, it's)
- No fluff. Answer the question, then stop.
- If you don't know something, say "Not sure about that one, but..." and pivot to what you DO know
- Ask follow-up questions to keep them engaged
- Use casual language: "Yeah!", "Totally", "For sure"

Think: Text message conversation, not email. People have short attention spans.

Examples:
Bad: "That's a great question! I'm so glad you asked. Let me tell you all about our services. We offer a comprehensive range of solutions..."
Good: "We offer AI automation and data analytics. Which one sounds more useful for you?"`;

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
