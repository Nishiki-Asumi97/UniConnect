const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model defined

// Signup Route to store data in MongoDB
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Log the received data for debugging
        console.log('Received signup data:', { name, email, password });

        // Simple validation
        if (!name || !email || !password) {
            console.log('Missing fields');
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save a new user with hashed password
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        console.log('User created successfully');
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        // Log the error for debugging
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
