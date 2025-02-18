const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/generate-questions', async (req, res) => {
    try {
        const { topic } = req.body;
        
        const prompt = `Create 10 multiple choice questions about ${topic}. 
        Format each question as a JSON object with the following structure:
        {
            "question": "The question text",
            "options": ["option A", "option B", "option C", "option D"],
            "correctAnswer": 0 // index of correct answer
        }
        Return an array of 10 such question objects.`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            temperature: 0.7,
        });

        const questions = JSON.parse(completion.choices[0].message.content);
        res.json({ questions });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
