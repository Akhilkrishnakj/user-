// Requring the schema for Usermodel
const User = require('../models/userModel');

// using the bcrypt module for encrypting the password
const bcrypt = require('bcrypt')

// This is the function to encrypting the password
const securePassword = async(password)=>{
    try{

        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;

    }catch(error){
        console.log("An error is founded" + error.message)
    }
}

//Loading the landing page
const loadStart = async(req,res)=>{

    try{

        res.render('users/start')
        console.log("User in the start page")

    }catch(error){
        console.log("Sorry a error founded :- " + error)
    }

}

//Loading the Registration page
const loadRegister = async(req,res)=>{

    try{

        const message = "";
        res.render('users/registration', { message })
        console.log("User in the Registeration page")

    }catch(error){
        console.log("Sorry a error founded :- " + error)
    }

}

//Inserting the new user
const insertUser = async(req,res)=>{

    try{

        // Check if the email already exists in the database. 
        // it will stop execution return a message the e-mail already exists.
        const existingUser = await User.findOne({ email: req.body.email });
        
        if (existingUser) {
            res.render('users/registration', { message: "This email ID is already in use. Please use a different email." });
            return; 
        }

        //it will encrypting the password by calling the function securePassword.
        const sPassword = await securePassword(req.body.password);

        //it will create a instance of a model to save the detail of the user.
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: sPassword
        });

        //it will save the details to the database.
        const userData = await user.save();

        //if details is saved it will redirect to the login page. otherwise it will stay in the registeration page.
        if(userData){
            res.redirect('/user/login')
            console.log("User is succesfully registered")
        }else{
            res.render('users/registration', {message:"Your Registration has been succesfully Failed."})
        }

    }catch(error){
        console.log(error.message)
    }

}

//loading the login form
const loadLogin = async (req, res) => {
    
    try {

        const message = "";
        res.render('users/login', { message })
        console.log("User in the Login page")
        
    } catch (error) {
        console.log(error.message)
    }

}

//Verify the details that entered by the user in the login form and validate with database
const verifyLogin = async (req, res) => {
    
    try {
        console.log(req.body)
        const email = req.body.email;
        const password = req.body.password;
        
        // the email entered by user is check in the database and find the match one.
        const userData = await User.findOne({email:email});

        if (userData) {
            // the compare is will check the password with the encrycpted password.
            const passwordMatch = await bcrypt.compare(password, userData.password)
            console.log(passwordMatch);

            if (passwordMatch) {

                req.session.user_id = userData._id;
                res.redirect('/user/home')
 
            } else {
                res.render('users/login', {message:"Invaild password"})
            }
            
        } else {
            res.render('users/login', {message:"Invaild email"})
        } 
        
    } catch (error) {
        console.log(error.message)
    }

}

// It will shows the home page
const loadHome = async (req, res) => {
    
    try {

        // it will share the details of the user.
        const user = await User.findById(req.session.user_id);
        // it will share the name of the username to the home page.
        const message = `Welcome ${user.name}`;
        res.render('users/home', { message });
        console.log("User in the home page");

    } catch (error) {
        console.log(error.message)
    }

}

// this function to handle logout and destroy session
const logout = (req, res) => {
    req.session.destroy((err) => { 
        if (err) {
            return res.status(500).send('Failed to destroy session');
        }
        res.redirect('/');
    });
};


module.exports = {
    loadStart,
    loadRegister,
    insertUser,
    loadLogin,
    verifyLogin,
    loadHome,
    logout,
}