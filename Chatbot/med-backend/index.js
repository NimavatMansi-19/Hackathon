const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [
          { role: "system", content: "You are a helpful medical assistant chatbot. Always advise users to consult a doctor." },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 200,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content.trim(); // ✅ Corrected
    res.json({ reply });

  } catch (error) {
    console.error("Together.ai Error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Together.ai failed: " + error.message });
  }
});

app.listen(5000, () => {
  console.log("✅ Together.ai backend running at http://localhost:5000");
});
