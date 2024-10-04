const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Import the User model

// Route to update user profile
router.put('/', async (req, res) => {
    const { email, name, phone, dob } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile
        user.name = name;
        user.phone = phone;
        user.dob = dob;

        // Save the updated profile
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
