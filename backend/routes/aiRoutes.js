const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/generate-content — Generate description, SEO tags, marketing caption
router.post('/generate-content', async (req, res) => {
  try {
    const { productName, category, price } = req.body;

    if (!productName) {
      return res.status(400).json({ message: 'Product name is required.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert e-commerce copywriter and SEO specialist. 
For the product below, generate:
1. A compelling product description (2-3 sentences, professional and persuasive).
2. Exactly 5 SEO tags as a comma-separated list.
3. A short, catchy marketing caption for social media (1 sentence).

Product Name: ${productName}
Category: ${category || 'General'}
Price: $${price || 'N/A'}

Respond ONLY in this exact JSON format, no markdown, no code blocks:
{"description": "...", "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5"], "marketingCaption": "..."}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse the JSON from Gemini's response
    let parsed;
    try {
      // Try to extract JSON if wrapped in code blocks
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseErr) {
      return res.status(500).json({
        message: 'AI returned an invalid response. Please try again.',
        raw: responseText,
      });
    }

    res.json({
      message: 'AI content generated successfully!',
      data: {
        description: parsed.description || '',
        seoTags: parsed.seoTags || [],
        marketingCaption: parsed.marketingCaption || '',
      },
    });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    res.status(500).json({ message: 'AI generation failed.', error: err.message });
  }
});

// POST /api/ai/insights — AI sales suggestions, pricing, trending, inventory alerts
router.post('/insights', async (req, res) => {
  try {
    // Get all products for context
    const products = await Product.find().lean();

    if (products.length === 0) {
      return res.json({
        message: 'No products found. Add products to get AI insights.',
        data: { pricing: [], trending: [], inventoryAlerts: [] },
      });
    }

    const productSummary = products
      .map(
        (p) =>
          `- ${p.name} | Category: ${p.category} | Price: $${p.price} | Stock: ${p.stock} | Units Sold: ${p.salesData?.unitsSold || 0} | Revenue: $${p.salesData?.revenue || 0}`
      )
      .join('\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a senior e-commerce business analyst AI. Analyze the following product inventory and sales data and provide actionable insights.

Products:
${productSummary}

Provide your analysis in this exact JSON format (no markdown, no code blocks):
{
  "pricing": [
    {"product": "product name", "recommendation": "specific pricing advice", "reason": "why"}
  ],
  "trending": [
    {"insight": "specific trend observation", "action": "recommended action"}
  ],
  "inventoryAlerts": [
    {"product": "product name", "currentStock": number, "alert": "specific alert message"}
  ]
}

Rules:
- For pricing: suggest price changes based on sales performance.
- For trending: identify patterns and opportunities.
- For inventoryAlerts: flag products with stock <= 15 as low stock.
- Keep each recommendation concise (1-2 sentences).
- Return at least 1 item per category.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    let parsed;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseErr) {
      return res.status(500).json({
        message: 'AI returned an invalid response.',
        raw: responseText,
      });
    }

    res.json({
      message: 'AI insights generated!',
      data: {
        pricing: parsed.pricing || [],
        trending: parsed.trending || [],
        inventoryAlerts: parsed.inventoryAlerts || [],
      },
    });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    res.status(500).json({ message: 'AI insights failed.', error: err.message });
  }
});

module.exports = router;
