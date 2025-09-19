const mongoose = require("mongoose");
const User = require("./models/User");

// Database Connection
require('dotenv').config();
const mongo_url = process.env.MONGODB_URI;

async function clearDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongo_url);
        console.log("✅ Connected to MongoDB");

        // Delete all users
        const result = await User.deleteMany({});
        console.log(`🗑️  Deleted ${result.deletedCount} user(s) from database`);

        // Close connection
        await mongoose.connection.close();
        console.log("✅ Database connection closed");
        console.log("🎉 Database cleanup completed successfully!");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during database cleanup:", error);
        process.exit(1);
    }
}

clearDatabase();