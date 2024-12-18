//Connect The project to the mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management")
.then(() => {
    console.log("Database is connected");
})
.catch((error) => {
    console.log("Database connection failed:", error.message);
});

//requiring the express.js Hello
const express = require('express');
const app = express();

//requiring body-parser and setting as a middleware 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Setting the public folder as public fo serving css,img,js,e.t.c..
app.use(express.static('public'))

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', './views'); // Set the base views folder for EJS templates

const session = require('express-session');
app.use(session({
    secret: 'abcd1234', // your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

//Using nocache
const nocache = require('nocache');
app.use(nocache())

// requiring the flash module
const flash = require('connect-flash');
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

//For User routes
const userRoutes = require('./routes/userRoutes')
app.use('/', userRoutes);

//For admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/',hai,adminRoutes)

function hai(req,res,next){
    console.log("admin Route")
    next();
}

// Start the server in port 3000
app.listen(3000, ()=>{
    console.log("Server is running in http://localhost:3000")
})