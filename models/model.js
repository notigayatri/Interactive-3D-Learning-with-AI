const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema({
    name: String, 
    description: String, // Optional: Can store static part descriptions
});

const ModelSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    modelPath: String, // Path or model identifier
    parts: [PartSchema] // Stores parts of the model
});

module.exports = mongoose.model('Model', ModelSchema);
