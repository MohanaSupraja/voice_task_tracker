const express = require("express");
const router = express.Router();
const { extractTaskData } = require("../utils/nlp");

router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const parsed = await extractTaskData(text); 
    res.json(parsed);
  } catch (err) {
    console.error("Parse error:", err);
    res.status(500).json({ error: "Failed to parse text" });
  }
});

module.exports = router;
