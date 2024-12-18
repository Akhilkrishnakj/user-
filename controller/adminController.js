// Requring the schema for Usermodel
const User = require('../models/userModel');

// using the bcrypt module for encrypting the password
const bcrypt = require('bcrypt');

// This is the function to encrypting the password
const securePassword = async(password)=>{
    try{

        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;

    }catch(error){
        console.log("An error is founded" + error.message)
    }
}

//Loading the Registration page
const loadlogin = async(req,res)=>{

    try{

        res.render('admin/login', { error: '' })

    }catch(error){
        console.log("Sorry a error founded :- " + error)
    }

}

// this function will verify the email and password entered by the admin.
const verifyAdminLogin = async (req, res) => {

    //predefined email and password
    const ADMIN_EMAIL = 'ad@123';
    const ADMIN_PASSWORD = 'ad123';
    
    try {
        
        // it will store the email and password entered by the admin.
        const { email, password } = req.body;

        // Check if the entered credentials match the predefined values
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            
            req.session.isAdmin = true;
            res.redirect('/admin/dashboard');
            console.log("Admin logged in succesfully")
        } else {
            // If incorrect, re-render the login page with an error message
            res.render('admin/login', { error: 'Invalid email or password' });
        }
        
    } catch (error) {
        console.log(error.message)
    }

}

// this function will load admin Dashboard.
const loadAdminDashboard = async (req, res) => {
    
    try {
        
        // it will send the details of the user to show in the dashboard
        const user = await User.find();

        // this is for sending the flash message.
        const successMessage = req.session.successMessage;
        const errorMessage = req.session.errorMessage;

        // Clear messages from the session
        req.session.successMessage = null;
        req.session.errorMessage = null;

        res.render('admin/dashboard', { successMessage, errorMessage, user });
        
        
    } catch (error) {
        console.log(error.message)
    }

}

//Inserting the new user
const addUser = async(req,res)=>{

    try{

        // Check if the email already exists in the database. 
        // it will stop execution return a message the e-mail already exists.
        const existingUser = await User.findOne({ email: req.body.email });
        
        if (existingUser) {
            req.session.errorMessage = "email already exists";
            res.redirect('/admin/dashboard')
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
            req.session.successMessage = "User created Successfully";
            res.redirect('/admin/dashboard')
        }else{
            req.session.errorMessage = "Error deleting user";
            res.redirect('/admin/dashboard')
        }

    }catch(error){
        console.log(error.message)
    }

}

// this is the function that delete the user by userId.
const deleteUser = async (req, res) => {
    try {

        //this variable will store the id of the user which want to delete the user.
        const userId = req.params.id;

        //it will find and delete the user.
        await User.findByIdAndDelete(userId);

        //it will send a flash message.
        req.session.successMessage = "User deletion successful";
        console.log(`User deleted succesfully`)
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log("Error deleting user:", error);
        req.session.errorMessage = "Error deleting user";
        res.redirect('/admin/dashboard');
    }
};

//this function is used for update a user.
const updateUser = async (req, res) => {

    //it will store the detail of the user.
    const { userId, name, email, mobile } = req.body;
    console.log('Received userId:', userId);

    try {
        // this will find the user by id and update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, mobile },
            { new: true } // this is for returning the updated document
        );

        //it will send the flash the message and redirect to the dashboard.
        req.session.successMessage = "User updated successfully!";
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log("Error updating user:", error);
        req.session.errorMessage = "Error updating user.";
        res.redirect('/admin/dashboard');
    }
};

// this function will search the user and send the detail of the user.
const searchUser = async (req, res) => {

    //it will store the data that entered the user.
    const query = req.query.query;

    try {
        let users;

        //it find the user's name and email that matching with the detail entered by the user.
        if (query) {
            users = await User.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            });
        } else {
            users = await User.find();
        }

        //if no user found it will send error flash message.
        if (users.length === 0) {
            req.session.errorMessage = "No users found";
        }

        res.render('admin/dashboard', { user: users, successMessage: req.session.successMessage, errorMessage: req.session.errorMessage });
        req.session.successMessage = null;  // Clear after rendering
        req.session.errorMessage = null;

    } catch (error) {
        console.log("Error in searchUser:", error.message);
        req.session.errorMessage = "Error during user search";
        res.redirect('/admin/dashboard');
    }
};

// this function to handle logout and destroy session
const logoutAdmin = async (req, res) => {
    
    try {

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Failed to destroy session');
            }
            res.redirect('/');
        });
        
    } catch (error) {
        console.log(error.message)
    }

}




module.exports = {
    loadlogin,
    verifyAdminLogin,
    loadAdminDashboard,
    addUser,
    deleteUser,
    updateUser,
    searchUser,
    logoutAdmin

}