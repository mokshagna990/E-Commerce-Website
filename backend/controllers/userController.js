const User = require('../models/userModel');
const UserHistory = require('../models/userHistoryModel');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'abc123', { expiresIn: '30d' });
};

// ✅ Google Authentication
const googleAuthHandler = async (req, res) => {
    try {
        const { credential } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: 'GOOGLE-AUTH-' + Math.random().toString(36).slice(-8),
                picture,
                isGoogleUser: true
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid Google credentials' });
    }
};

// ✅ Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ✅ Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ✅ Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ✅ Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: generateToken(updatedUser._id)
        });

    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ✅ Get All Users (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ✅ Delete User (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ✅ Fetch User Purchase History
const getUserHistory = async (req, res) => {
    try {
        const userId = req.params.userId;

        const userData = await UserHistory.aggregate([
            { $match: { user_id: userId } },
            {
                $group: {
                    _id: "$user_id",
                    categories: { $addToSet: "$category" },
                    average_spent: { $avg: "$price" }
                }
            }
        ]);

        if (userData.length === 0) {
            return res.status(404).json({ message: "No purchase history found" });
        }

        res.json(userData[0]);
    } catch (error) {
        console.error("Get User History Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Exporting all functions
module.exports = {
    googleAuthHandler,
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserHistory
};
