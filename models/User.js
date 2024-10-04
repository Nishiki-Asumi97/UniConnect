const mongoose = require('mongoose');

// Define a User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true }, // Ensure email is unique
    password: String
});

// Export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
