const express = require('express');

const router = express.Router();
const Model = require('../models/Model');
const { generateGeminiResponse } = require('../services/geminiService');

// POST: Create a new 3D model
router.post('/', async (req, res) => {
    try {
        const { name, description, category } = req.body;
        if (!name || !description || !category) {
            return res.status(400).json({ error: 'Name, description, and category are required' });
        }

        const model = new Model({ name, description, category });
        await model.save();
        res.status(201).json(model);
    } catch (err) {
        console.error('Create model error:', err);
        res.status(500).json({ error: 'Failed to create model', details: err.message });
    }
});

// GET: Fetch all 3D models
router.get('/', async (req, res) => {
    try {
        const models = await Model.find();
        res.status(200).json(models);
    } catch (err) {
        console.error('Fetch models error:', err);
        res.status(500).json({ error: 'Failed to fetch models', details: err.message });
    }
});

// POST: Get explanation from Gemini API
router.post('/explain', async (req, res) => {
    const { prompt } = req.body;
  
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
  
    try {
        // Generate text using Gemini
        const explanation = await generateGeminiResponse(prompt);
        if (!explanation) {
            throw new Error('Failed to generate explanation from Gemini');
        }

        // Send the explanation as JSON
        res.status(200).json({ explanation });
    } catch (error) {
        console.error('Error generating explanation:', error);
        res.status(500).json({ 
            error: 'Failed to generate explanation', 
            details: error.message 
        });
    }
});

module.exports = router;
