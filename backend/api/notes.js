const express = require('express');
const router = express.Router();
const Note = require('../models/Note');



// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required!" });
  }

  try {
    const newNote = new Note({ title, body });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    if (err.code === 11000) {  // MongoDB duplicate key error
      res.status(409).json({ message: "A note with this title already exists!" });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

// Update a note (auto-save)
router.put('/:id', async (req, res) => {
  const { title, body } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, body, updatedAt: Date.now() },
      { new: true }  // Returns the updated note
    );
    res.json(updatedNote);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "Title already exists!" });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;