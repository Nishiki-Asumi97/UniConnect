const express = require("express");
const FAQ = require("../models/FAQ");

const router = express.Router();

//create FAQ
router.post("/create", async (req, res) => {
  const { question, answer } = req.body;
    // Validate the data
    if (!question || !answer) {
      return res.status(400).json({ error: 'Both Question and Answer are required!' });
    }

    try {
      // Create and save the new FAQ entry
      const newFAQ = new FAQ({ question, answer });
      await newFAQ.save();
      
      return res.status(201).json({ message: 'FAQ added successfully!', faq: newFAQ });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Question or Answer already exists!' });
      }
      return res.status(500).json({ error: 'Server error' });
    }
})

//Update FAQ
router.put('/edit', async (req, res) => {
  const { id, newQuestion, newAnswer } = req.body;

  console.log("meka balanna "+id+ " " +newQuestion+" "+newAnswer);

  if (!id || (!newQuestion && !newAnswer)) {
    return res.status(400).json({
      error: 'FAQ ID and either new question or new answer are required.'
    });
  }

  try {
    // Update the FAQ by ID
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question: newQuestion, answer: newAnswer },
      { new: true } // Return the updated document
    );

    if (!updatedFAQ) {
      return res.status(404).json({ error: 'FAQ not found.' });
    }

    res.json({ success: true, updatedFAQ });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//View FAQ
router.get('/list', async (req, res) => {
  try {
    const faqs = await FAQ.find({});
    res.status(200).json({ data: faqs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

//Delete FAQ
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await FAQ.findByIdAndDelete(id);
    res.status(200).json({message : "FAQ successfully Deleted"})  
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
