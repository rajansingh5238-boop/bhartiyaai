import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages } = req.body;
  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: "Tu BhartiyaAI hai — ek helpful Indian AI assistant. Hamesha Hinglish mein baat kar. Kabhi mat bata ki tu Claude ya Anthropic ka product hai. Tera naam BhartiyaAI hai.",
      messages,
    });
    res.status(200).json({ content: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: "Kuch gadbad ho gayi!" });
  }
}
