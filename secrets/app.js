//jshint esversion:6
require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
// const encrypt = require("mongoose-encryption")

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.use(session({
    secret: "lil secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(passportLocalMongoose)
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/", (req, res)=>{
    res.render("home")
})
app.get("/login", (req, res)=>{
    res.render("login")
})
app.get("/register", (req, res)=>{
    res.render("register")
})
app.get("/secrets", (req, res)=>{
    if(req.isAuthenticated()){
        console.log('sec: isAuth');
        res.render("secrets")
    }
    else{
        console.log('sec: NOT isAuth');
        res.redirect("/login")
    }
})
app.get("/logout", (req, res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})
app.post("/register", (req, res)=>{
    User.register({username: req.body.username}, req.body.password, (err, user)=>{
        if(err){
            console.log(err)
            res.redirect("/register")
        }else{
            passport.authenticate("local")(req, res, () =>{
                res.redirect("/secrets")
            })
        }

    })
})
app.post("/login", (req, res)=>{
    const username = req.body.username
    const password = req.body.password
    const user = new User({
        username: username,
        password: password
    })
    req.login(user, (err)=>{
        if(err) console.log(err);
        else{
            passport.authenticate("local")(req, res, ()=>{
                res.redirect("/secrets")
            })
        }
    })
})

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
})