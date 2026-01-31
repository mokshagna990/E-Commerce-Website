/*const winston = require('winston');

// Function to sanitize sensitive data
const sanitizeData = (data) => {
    if (!data) return data;
    
    const sensitiveFields = ['password', 'token', 'authorization', 'credit_card', 'cvv'];
    const sanitized = JSON.parse(JSON.stringify(data));

    const maskValue = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                maskValue(obj[key]);
            } else if (sensitiveFields.includes(key.toLowerCase())) {
                obj[key] = '********';
            }
        }
    };

    maskValue(sanitized);
    return sanitized;
};

// Create custom format
const sanitizeFormat = winston.format((info) => {
    if (info.body) {
        info.body = sanitizeData(info.body);
    }
    if (info.headers) {
        info.headers = sanitizeData(info.headers);
    }
    if (info.query) {
        info.query = sanitizeData(info.query);
    }
    return info;
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        sanitizeFormat(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
            return `[${timestamp}] [${level.toUpperCase()}] ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta) : ''
            }`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            filename: 'logs/combined.log' 
        }),
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error' 
        })
    ]
});

// Explicitly bind logging methods
const boundLogger = {
    error: logger.error.bind(logger),
    warn: logger.warn.bind(logger),
    info: logger.info.bind(logger),
    debug: logger.debug.bind(logger),
    http: logger.http.bind(logger)
};

module.exports = boundLogger;
*/