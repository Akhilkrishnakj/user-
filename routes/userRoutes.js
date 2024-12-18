//requiring express router
const express = require('express');
const user_route = express.Router();

//requiring the auth middleware to handle the session.
const auth = require("../middleware/auth")

//requiring the controller for loading the pages.
const userController = require("../controller/userController")

// It will shows the start pagess
user_route.get('/',auth.is_UserLogout,auth.is_AdminLogout,  userController.loadStart);

// It will shows the registeration form
user_route.get('/user/register',auth.is_UserLogout,auth.is_AdminLogout, userController.loadRegister);

// It will take the values from the registeration form and give the inserUser function
user_route.post('/user/register', userController.insertUser)

// It will shows the login form
user_route.get('/user/login',auth.is_UserLogout,auth.is_AdminLogout,userController.loadLogin);

// It will take the values from the Login form and give the for the validation purpose.
user_route.post('/user/login', userController.verifyLogin);

// It will shows the home page
user_route.get('/user/home',auth.is_UserLogin,auth.is_AdminLogout, userController.loadHome)

// it will logout the user from the home page
user_route.get('/user/logout',auth.is_UserLogin,auth.is_AdminLogout, userController.logout);


module.exports = user_route;