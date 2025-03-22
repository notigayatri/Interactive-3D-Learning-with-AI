// Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./db');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json()); // Parse JSON request body
app.use(express.json());  // Alternative to body-parser

// Connect to MongoDB
connectDB();

// Routes
const modelRoutes = require('./routes/modelRoutes');
const partRoutes = require('./routes/partRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/models', modelRoutes);
app.use('/api/models', partRoutes);
app.use('/api/models', categoryRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
