const express = require("express");
const FAQ = require("../models/FAQ");

const router = express.Router();

// Route to get the list of FAQs
router.get('/list', async (req, res) => {
  console.log("user faq list ekta awa");
  try {
    const faqs = await FAQ.find({});
    res.status(200).json({ data: faqs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

module.exports = router;
