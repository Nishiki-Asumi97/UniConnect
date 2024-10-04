// Import necessary modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import the User model (adjust the path to match your project structure)
const User = require('../models/User'); // Modify this path if needed

// MongoDB connection string
const mongoURI = "mongodb+srv://ashishraturi8680:mQiLow9KlnF03xh5@uniconnect.j21qy.mongodb.net/UniConnect?retryWrites=true&w=majority";

// Connect to MongoDB with updated options
mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverSelectionTimeoutMS: 30000 // Optional: Increases connection timeout to 30 seconds
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Function to hash user passwords
async function hashPasswords() {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        
        // Loop through users and hash their passwords if not already hashed
        for (let user of users) {
            // Check if the password is already hashed (bcrypt hashes have 60 characters)
            if (user.password.length < 60) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                
                // Update user password with hashed password
                user.password = hashedPassword;
                await user.save();
                console.log(`Password for user ${user.email} has been hashed and updated.`);
            }
        }
    } catch (err) {
        // Catch and log any errors during the process
        console.error('Error updating passwords:', err);
    } finally {
        // Close the MongoDB connection after operation completes
        mongoose.connection.close();
    }
}

// Run the hashPasswords function
hashPasswords();
