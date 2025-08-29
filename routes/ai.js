const express = require('express');
const OpenAI = require('openai');
const config = require('../config');
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

// Classify post intent and extract structured data
router.post('/classify-post', async (req, res) => {
  try {
    const { prompt, imageUrl } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = `You are an AI assistant for a campus feed app at NIT Rourkela. Your job is to analyze student input and classify it into one of three post types:

1. EVENT - for workshops, college fest, club activities, seminars, etc.
2. LOSTFOUND - for lost or found items
3. ANNOUNCEMENT - for official notices, timetables, campus updates

Based on the user's input, return a JSON object with this exact structure:

{
  "type": "event|lostfound|announcement",
  "confidence": 0.0-1.0,
  "title": "Generated title for the post",
  "description": "Detailed description based on the input",
  "extractedData": {
    // For EVENT type:
    "location": "extracted location or null",
    "date": "extracted date in ISO format or null",
    
    // For LOSTFOUND type:
    "itemType": "lost|found",
    "location": "last known location or found location",
    "contactInfo": "extracted contact info or null",
    
    // For ANNOUNCEMENT type:
    "department": "extracted department or null",
    "priority": "low|medium|high"
  }
}

Rules:
- Always return valid JSON
- Be confident in classification - use common sense
- Extract all relevant details from the input
- If date/time mentioned, convert to proper format
- For lost/found, determine if item was lost or found
- Keep titles concise but descriptive
- Make descriptions comprehensive but not repetitive`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Classify this campus post: "${prompt}"` }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', completion.choices[0].message.content);
      throw new Error('Invalid AI response format');
    }

    // Validate the response structure
    if (!aiResponse.type || !['event', 'lostfound', 'announcement'].includes(aiResponse.type)) {
      throw new Error('Invalid post type classification');
    }

    // Add image URL if provided
    if (imageUrl) {
      if (aiResponse.type === 'lostfound') {
        aiResponse.extractedData.imageUrl = imageUrl;
      } else if (aiResponse.type === 'announcement') {
        aiResponse.extractedData.attachmentUrl = imageUrl;
        aiResponse.extractedData.attachmentType = 'image';
      }
    }

    res.json(aiResponse);

  } catch (error) {
    console.error('AI classification error:', error);
    
    // Fallback response in case of AI failure
    const fallbackResponse = {
      type: 'announcement',
      confidence: 0.5,
      title: 'Campus Update',
      description: req.body.prompt,
      extractedData: {
        department: 'General',
        priority: 'medium'
      }
    };

    res.json(fallbackResponse);
  }
});

// Generate suggestions for improving post content
router.post('/enhance-post', async (req, res) => {
  try {
    const { type, title, description, extractedData } = req.body;

    const systemPrompt = `You are helping students at NIT Rourkela improve their campus posts. Based on the post type and content, suggest improvements to make the post more engaging and informative.

Return a JSON object with:
{
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    ...
  ],
  "improvedTitle": "enhanced title",
  "improvedDescription": "enhanced description"
}

Keep suggestions practical and specific to campus life.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Post type: ${type}\nTitle: ${title}\nDescription: ${description}\nExtracted data: ${JSON.stringify(extractedData)}` }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    res.json(aiResponse);

  } catch (error) {
    console.error('AI enhancement error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

module.exports = router;
