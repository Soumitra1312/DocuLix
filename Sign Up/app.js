if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer = require("multer");
const User = require("./models/User"); // Import User model
const userRoutes = require("./routes/User"); // Import routes

// ----------------------
// Database Connection
// ----------------------


const mongo_url = process.env.MONGODB_URI;
// Enable Mongoose debug logging
mongoose.set('debug', true);
// Print the MongoDB URI being used
console.log('Connecting to MongoDB with URI:', mongo_url);

async function main() {
    await mongoose.connect(mongo_url);
}
main()
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.log(err));

// ----------------------
// App Config
// ----------------------
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json()); // To parse JSON data

// Configure multer for handling multipart/form-data
const upload = multer();
app.use(upload.none()); // For forms without file uploads

// ----------------------
// Session Config
// ----------------------
const sessionConfig = {
    secret: "thisshouldbeabettersecret", // replace with strong secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));

// ----------------------
// Passport Config
// ----------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ----------------------
// Routes
// ----------------------
app.use("/", userRoutes);

app.get("/", (req, res) => {
    res.render("Home.ejs");
});

// ----------------------
// Start Server
// ----------------------
app.listen(8080, () => {
    console.log("✅ Server running at http://localhost:8080");
});
