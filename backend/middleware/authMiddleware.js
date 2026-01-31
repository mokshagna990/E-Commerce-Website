const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'No Bearer Token' 
            });
        }

        const token = authHeader.replace('Bearer ', '');
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({ 
                    message: 'User not found' 
                });
            }

            req.user = user;
            req.token = token;
            next();
            
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    message: 'Invalid token' 
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    message: 'Token expired' 
                });
            }
            throw error;
        }

    } catch (error) {
        res.status(500).json({ 
            message: 'Server authentication error' 
        });
    }
};

module.exports = { protect };

