const express = require('express');
const router = express.Router();
const Model = require('../models/Model');

// POST: Add or update parts of a model
router.post('/:modelName/parts', async (req, res) => {
    try {
        const { modelName } = req.params;
        const { parts } = req.body;

        if (!parts || !Array.isArray(parts)) {
            return res.status(400).json({ error: 'Parts list is required and must be an array' });
        }

        const model = await Model.findOne({ name: modelName });

        if (!model) {
            return res.status(404).json({ error: 'Model not found' });
        }

        // Append new parts to the existing parts list
        model.parts = [...model.parts, ...parts];
        await model.save();

        res.status(200).json({ message: 'Parts saved successfully', model });
    } catch (err) {
        console.error('Error saving parts:', err);
        res.status(500).json({ error: 'Failed to save parts' });
    }
});

// GET: Fetch parts of a model
router.get('/category/:category/:subcategory/:model/parts', async (req, res) => {
    try {
        const { category, subcategory, model } = req.params;

        const modelName = decodeURIComponent(model);

        // Find the model by name, category, and subcategory
        const modelData = await Model.findOne({ 
            name: modelName, 
            category, 
            subcategory 
        }).select('parts');

        if (!modelData || !modelData.parts || modelData.parts.length === 0) {
            return res.status(404).json({ error: 'No parts found for this model' });
        }

        res.status(200).json({ parts: modelData.parts });
    } catch (err) {
        console.error('Error fetching parts:', err);
        res.status(500).json({ error: 'Failed to fetch parts' });
    }
});


module.exports = router;
