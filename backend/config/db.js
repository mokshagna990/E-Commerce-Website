const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegancia', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;

    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        throw error; // Let the calling code handle the error
    }
};

module.exports = connectDB;
