require('dotenv').config({ path: '../config/config.env' });

const config = {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/safe',
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5001
};

module.exports = config; 
