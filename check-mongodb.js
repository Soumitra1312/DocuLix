require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/legal_ai_auth';

async function checkMongoDB() {
    try {
        await mongoose.connect(uri, { 
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        });
        console.log('✅ Local MongoDB connection verified');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.log('❌ Local MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

checkMongoDB();