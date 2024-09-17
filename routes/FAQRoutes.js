const express = require("express");
const FAQ = require("../models/FAQ");

const router = express.Router();

//create FAQ
router.post("/create", async (req, res) => {
  const { question, answer } = req.body;
    console.log("submit ekat awa");
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

router.get('/list', async (req, res) => {
  try {
    const faqs = await FAQ.find({});
    res.status(200).json({ data: faqs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

module.exports = router;
