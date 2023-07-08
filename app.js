require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// const secret = "thisissecret";
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
    res.render("home")
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.post("/register", (req, res) => {
    const newUser = User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(() => {
        res.render("secrets")
    }).catch((err) => {
        console.log(err)
    })
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }).then((found) => {
        if (found.password === password) {
            res.render("secrets");
        }
    }).catch((err) => {
        console.log(err);
    })
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
});