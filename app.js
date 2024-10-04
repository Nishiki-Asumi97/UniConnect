const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs'); // Import filesystem module for reading JSON files
const viewRoutes = require('./routes/viewRoutes');  // Import the view routes
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');  // Import the signup route
const profileRoute = require('./routes/profile'); // Import the profile route
const User = require('./models/User');  // Import the User model

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoURI = "mongodb+srv://ashishraturi8680:mQiLow9KlnF03xh5@uniconnect.j21qy.mongodb.net/UniConnect?retryWrites=true&w=majority";

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error: ', err));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API route to serve event data from events.json
app.get('/api/events', (req, res) => {
    const filePath = path.join(__dirname, 'data/events.json'); // Path to your events.json file

    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading file:', err); // Log the error for debugging
            return res.status(500).json({ message: 'Error reading event data' });
        }
        const events = JSON.parse(data); // Parse the data from the JSON file
        res.json(events); // Send the events data as a JSON response
    });
});

app.post('/profile', async (req, res) => {
    try {
        // Logic to handle profile update or retrieval
        const { email } = req.body; // Assuming you're sending the user's email in the request body

        const user = await User.findOne({ email });
        if (user) {
            res.json({
                message: 'Profile fetched successfully',
                user: user, // Send back user profile data
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Handle signup POST request
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const newUser = new User({ name, email, password: hashedPassword });

        // Save user to MongoDB
        await newUser.save();
        res.json({ message: 'User created successfully' });
    } catch (err) {
        // Handle errors (like duplicate email)
        if (err.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Error saving user' });
        }
    }
});

// Use the view routes (index.html, login.html, login2.html, etc.)
app.use('/', viewRoutes);

// Use the login and signup routes
app.use('/login', loginRoute);  
app.use('/signup', signupRoute);
app.use('/profile', profileRoute);

// Use the profile route
app.use('/profile', profileRoute);  // This is the new profile update route

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
