//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/userDB",  
{useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    const newUser = new User({
        email : username,
        password : password,
    });

    newUser.save(err => {
        if(!err) {
            res.render("secrets");
        }
        else {
            console.log(err);
        }
    });
});


app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email:username}, (err, foundUser) => {
        if(!err) {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets");   
                }
                else {

                }
            }
        }
        else {
            console.log(err);
        }
    });
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});