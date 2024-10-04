const express = require('express');
const path = require('path');
const router = express.Router();

// Route for index.html
router.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// Route for login.html
router.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// Route for signup.html
router.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'signup.html'));
});

module.exports = router;
