const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware 
app.use(express.json());
app.use(cors());

// MongoDB Connection 
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Bro, MongoDB Connect ho gaya! 🚀"))
    .catch((err) => console.log("Database connection error: ", err));

// Basic Test Route
app.get('/', (req, res) => {
    res.send("Finance System API is running!");
});

// 🚀 YAHAN FIX KIYA HAI: Auth aur Finance dono APIs register kar diye hain
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/finance', require('./routes/finance'));

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🌐`));