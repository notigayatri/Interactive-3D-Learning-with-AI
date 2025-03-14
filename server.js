//To create an Express server 

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const connectDB = require('./db');
app.use(express.json());
// Connect to MongoDB
connectDB();

const modelRoutes = require('./routes/modelRoutes');

app.use('/models', modelRoutes);

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
