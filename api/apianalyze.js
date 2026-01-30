// api/analyze.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { answers, prompt } = req.body || {};
    if (!answers) return res.status(400).json({ error: "Missing answers" });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Responses API (recommended for new projects)
    const response = await openai.responses.create({
      model: "gpt-4.1-mini", // good default; swap later if you want
      input: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                prompt ||
                `Create a client-ready Markdown report for Gamma. 
Include: Executive Summary, Key Pain Points, Opportunities, 
Compare/Contrast tables (3 options), Budget/ROI analysis, and Next Steps.
Use headings and tables.`,
            },
            {
              type: "text",
              text: `Client answers JSON:\n${JSON.stringify(answers, null, 2)}`,
            },
          ],
        },
      ],
    });

    return res.status(200).json({ markdown: response.output_text });
  } catch (err) {
    return res.status(500).json({
      error: "Analysis failed",
      details: err?.message || String(err),
    });
  }
}
