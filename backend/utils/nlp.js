require("dotenv").config();
const { Together } = require("together-ai");
const chrono = require("chrono-node");

const client = new Together({
  apiKey:"c30b7dd9d209e40775e94bfc841b3a0613219fdff7544be58a6bef7849869403"
});

async function extractTaskData(text) {
  try {
    const today = new Date().toISOString().split("T")[0];
    console.log("today:",today);

    const response = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You extract structured task information from natural speech.

IMPORTANT:
- DO NOT convert or interpret dates.
- DO NOT compute actual calendar dates.
- ONLY return the extracted date PHRASE exactly as spoken (e.g. "next Monday", "tomorrow", "in two days").
- The backend will convert it.

Return STRICT JSON:
{
  "title": string,
  "priority": "Low" | "Medium" | "High",
  "status": "To Do" | "In Progress" | "Done",
  "dueDate": string | null,   ← this must contain the raw phrase only
  "confidence": number
}

Rules:
- "urgent", "critical" => High priority.
- Default priority = Medium.
- Default status = To Do.
- Title must be clean (no date/priority words).
`,
        },
        { role: "user", content: text },
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);
    console.log("parsed data:",data);

   if (data.dueDate) {
  const parsed = chrono.parseDate(data.dueDate, { timezone: 330 });
    console.log("parsed:",parsed)
  data.dueDate = parsed ? parsed.toISOString().split("T")[0] : null;
}

console.log("final date:",data.dueDate)
    data.transcript = text;
    return data;
  } catch (err) {
    console.error("LLM Task Parsing Error:", err);
    return {
      transcript: text,
      title: "",
      priority: "Medium",
      status: "To Do",
      dueDate: null,
      confidence: 0,
    };
  }
}

module.exports = { extractTaskData };
