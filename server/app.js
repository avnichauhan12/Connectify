const User = require('./models/user');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 8082;
const path = require("path");
//database connection
mongoose.connect('mongodb://127.0.0.1:27017/userRegistration', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/registration", (req, res) => {
    res.render("registration");
});


app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log("Server is running on port:", port);
});
