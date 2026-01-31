// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const { getUserHistory } = require("../controllers/userController");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post('/register', async (req, res) => {
    try {
        console.log('Registration attempt for email:', req.body.email);
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token
            });
        }
    } catch (error) {
        console.error('Register error:', error); // Debug log
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt for email:', req.body.email);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
        });
    } catch (error) {
        console.error('Login error:', error); // Debug log
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Google login route
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const { email, name, picture, sub: googleId } = ticket.getPayload();
        
        // Find or create user
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create new user if doesn't exist
            const randomPassword = Math.random().toString(36).slice(-16);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);
            
            user = await User.create({
                name,
                email,
                password: hashedPassword,
                picture,
                isGoogleUser: true,
                googleId
            });
        }
        
        // Generate token
        const token = generateToken(user._id);
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            picture: user.picture,
            token
        });
        
    } catch (error) {
        res.status(401).json({ 
            message: 'Invalid Google token',
            error: error.message 
        });
    }
});

router.get("/history/:userId", getUserHistory);

module.exports = router;
