const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));


// Root route
app.get('/', (req, res) => {
  res.send('Note-Taking API is running!');
});

// Notes router
const notesRouter = require('./notes');
app.use('/api/notes', notesRouter);


// Export as serverless function (NO app.listen!)
module.exports = app;