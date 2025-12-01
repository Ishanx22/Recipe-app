// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenRouter } = require("@openrouter/sdk");

const app = express();
const port = 5001;

// Middleware
app.use(cors());          // Allows cross-origin requests (needed for Vite dev)
app.use(express.json());   // Parse JSON request bodies

// Initialize OpenRouter client
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

// Test route to check if backend is running
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ChatGPT route
app.post("/api/chatgpt", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openrouter.chat.send({
      model: "google/gemma-3-12b-it:free",
      messages: [
        { role: "user", content: [{ type: "text", text: prompt }] }
      ],
      stream: false
    });

    // Extract recipe text correctly
    const reply = response.choices?.[0]?.message?.content || "No response";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemma 3 Error:", err);
    res.status(500).json({ reply: "❌ Backend Error" });
  }
});


// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
