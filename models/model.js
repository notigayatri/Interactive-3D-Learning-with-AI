//A schema defines the structure of the data that will be stored in MongoDB.

const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    filePath: { type: String } // Optional for future 3D models
});

const Model = mongoose.model('Model', modelSchema);

module.exports = Model;
