const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const FAQRoutes = require('./routes/FAQRoutes');
const FAQUserRoutes = require('./routes/FAQUserRoutes');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);  // Use HTTP server for socket.io
const io = socketIO(server);  // Initialize socket.io with the server

const connectDB = require('./db/db');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Connect to DB
connectDB();

app.get('/Events', (req, res) => {
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
app.use('/Events', categoryRoutes);

const eventRoutes = require('./routes/eventRoutes');
app.use('/Events', eventRoutes);

//FAQ route=============================================
app.use('/FAQ', FAQRoutes);

//FAQ User route=============================================
app.use('/FAQ/User', FAQUserRoutes);

// Socket.io setup (unique to yourself)
const FAQSocket = io.of('/FAQSocket');  // Custom namespace

FAQSocket.on('connection', (socket) => {
    console.log('A user connected to FAQ Socket');

    // Handle socket events
    socket.on('FAQSocketEvent', (data) => {
        console.log('Received FAQSocket:', data);
        // Emit an event back to the client
        socket.emit('FAQSocketResponse', { message: 'Hello from the FAQ server!' });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected from FAQ Socket');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
