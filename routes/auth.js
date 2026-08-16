const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SIGN UP ROUTE
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists!" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Signup successful! Please login." });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'supersecretkey123', 
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;