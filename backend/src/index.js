const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/family-tree')
.then(() => {
    console.log('Connected to MongoDB');
    console.log('Connection state:', mongoose.connection.readyState);
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Family Tree Maker API is running' });
});

const familyMemberRoutes = require('./routes/familyMembers');
app.use('/api/family-members', familyMemberRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});