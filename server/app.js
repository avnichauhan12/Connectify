const User = require('./models/user');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 8082;
const path = require("path");
const bcrypt = require('bcrypt');

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/userRegistration', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/registration", (req, res) => {
    res.render("registration");
});

app.post("/registration", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user with provided email already exists
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.json({ message: "User with this email already exists" });
        }

        // Check if user with provided username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.json({ message: "Username is already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();
        return res.redirect("/login");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "An error occurred while registering user" });
    }
});
//index page
app.get("/index",(req,res)=>{
    res.render("index");
})

// Login Route
app.post("/login", async (req, res) => {
    console.log("login");
    const { email, password } = req.body;
    
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "User is not registered" });
            console.log("User:", user);
        }
        
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", passwordMatch);
        if (!passwordMatch) {
            return res.json({ message: "Password is incorrect" });
        }
        
        // Authentication successful
        return res.redirect("/index");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "An error occurred while logging in" });
    }
});


// Start the server
app.listen(port, () => {
    console.log("Server is running on port:", port);
});
