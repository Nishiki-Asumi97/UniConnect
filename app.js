const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const FAQRoutes = require('./routes/FAQRoutes');
const FAQUserRoutes = require('./routes/FAQUserRoutes');

const app = express();

const connectDB = require('./db/db');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Connect to DB
connectDB();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'eventManagement.html'));
});

app.get('/FAQ', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'faqPageAdmin.html'));
});

app.get('/FAQ/User', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'faqPageUser.html'));
});

// Routes
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/', categoryRoutes);

const eventRoutes = require('./routes/eventRoutes');
app.use('/', eventRoutes);

//FAQ route=============================================
app.use('/FAQ', FAQRoutes);

//FAQ User route=============================================
app.use('/FAQ/User', FAQUserRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
