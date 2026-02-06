export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { responses } = req.body;

    const prompt = `
Analyze this business and recommend AI agents + automation:

${JSON.stringify(responses, null, 2)}

Return clean markdown with:
- Executive summary
- Pain points
- Recommended AI agents
- Tool stack
- Budget estimate
`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        max_output_tokens: 2000,
      }),
    });

    const data = await r.json();

    const text =
      data.output_text ||
      (data.output?.[0]?.content || [])
        .map((c) => (c.type === "output_text" ? c.text : ""))
        .join("");

    res.status(200).json({ reportMarkdown: text });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
