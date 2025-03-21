const express = require('express');
const router = express.Router();
const Model = require('../models/Model');

// GET all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Model.distinct('category');
        res.status(200).json(categories);
    } catch (err) {
        console.error('Fetch categories error:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET subcategories under a category
router.get('/categories/:category/subcategories', async (req, res) => {
    try {
        const { category } = req.params;
        const subcategories = await Model.distinct('subcategory', { category });

        res.status(200).json(subcategories);
    } catch (err) {
        console.error('Fetch subcategories error:', err);
        res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
});

// GET models under a specific subcategory
router.get('/categories/:category/:subcategory/models', async (req, res) => {
    try {
        const { category, subcategory } = req.params;
        const models = await Model.find({ category, subcategory });

        res.status(200).json(models);
    } catch (err) {
        console.error('Fetch models error:', err);
        res.status(500).json({ error: 'Failed to fetch models' });
    }
});

// GET models by category
router.get('/categories/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const models = await Model.find({ category });

        res.status(200).json(models);
    } catch (err) {
        console.error('Fetch models by category error:', err);
        res.status(500).json({ error: 'Failed to fetch models' });
    }
});

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

// GET: Fetch unique subcategories for a given category
router.get('/:category/subcategories', async (req, res) => {
    try {
        const { category } = req.params;
        const subcategories = await Model.distinct('subcategory', { category });

        res.status(200).json(subcategories);
    } catch (err) {
        console.error('Fetch subcategories error:', err);
        res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
});

module.exports = router;
