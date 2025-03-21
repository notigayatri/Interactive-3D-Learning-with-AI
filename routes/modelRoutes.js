const express = require('express');
const router = express.Router();
const Model = require('../models/Model');
const { generateGeminiResponse } = require('../services/geminiService');

// POST: Create a new 3D model
router.post('/', async (req, res) => {
    try {
        const { name, description, category, subcategory, modelPath } = req.body;
        if (!name || !description || !category) {
            return res.status(400).json({ error: 'Name, description, and category are required' });
        }

        // Ensure subcategory is stored in the model
        const model = new Model({ name, description, category, subcategory, modelPath });
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

// GET: Fetch models by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const models = await Model.find({ category });
        res.status(200).json(models);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch models' });
    }
});

// GET: Fetch basic model information when the model is opened
router.get('/:modelName/info', async (req, res) => {
    try {
        const { modelName } = req.params;
        const model = await Model.findOne({ name: modelName }).select('name description category subcategory modelPath');

        if (!model) {
            return res.status(404).json({ error: 'Model not found' });
        }

        res.status(200).json(model);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch model information' });
    }
});

// GET: Fetch full model details including parts
router.get('/:modelName', async (req, res) => {
    try {
        const { modelName } = req.params;
        const model = await Model.findOne({ name: modelName });

        if (!model) {
            return res.status(404).json({ error: 'Model not found' });
        }

        res.status(200).json(model);
    } catch (err) {
        console.error('Fetch model details error:', err);
        res.status(500).json({ error: 'Failed to fetch model details' });
    }
});

// GET: Fetch details of a specific part within a model
router.get('/:modelName/parts/:partName', async (req, res) => {
    try {
        const { modelName, partName } = req.params;
        const model = await Model.findOne({ name: modelName });

        if (!model) return res.status(404).json({ error: 'Model not found' });

        const part = model.parts.find(p => p.name === partName);
        if (!part) return res.status(404).json({ error: 'Part not found' });

        res.status(200).json(part);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch part details' });
    }
});

// GET: Generate explanation for a part using Gemini API
router.get('/:modelName/parts/:partName/explain', async (req, res) => {
    try {
        const { modelName, partName } = req.params;

        const model = await Model.findOne({ name: modelName });
        if (!model) return res.status(404).json({ error: 'Model not found' });

        const part = model.parts.find(p => p.name === partName);
        if (!part) return res.status(404).json({ error: 'Part not found' });

        // Generate explanation using Gemini AI
        const prompt = `Explain the function of ${part.name} in ${model.name}.`;
        const explanation = await generateGeminiResponse(prompt);

        res.status(200).json({ part, explanation });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate explanation' });
    }
});

// POST: Generate explanation for any query using Gemini API
router.post('/explain', async (req, res) => {
    const { prompt } = req.body;
  
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
  
    try {
        const explanation = await generateGeminiResponse(prompt);
        if (!explanation) {
            throw new Error('Failed to generate explanation from Gemini');
        }

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
