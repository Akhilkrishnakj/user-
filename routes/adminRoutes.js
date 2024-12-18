//requiring express 
const express = require('express');
const admin_route = express();

const auth = require('../middleware/auth')

const adminController = require('../controller/adminController')

// It will shows the admin login page
admin_route.get('/admin/login',  auth.is_UserLogout,auth.is_AdminLogout,adminController.loadlogin);

//it will take the details from login form and verify it
admin_route.post('/admin/login', adminController.verifyAdminLogin);

//it will shows the admin dash Board
admin_route.get('/admin/dashboard', auth.is_UserLogout, auth.is_AdminLogin,adminController.loadAdminDashboard);

//it will send the data that entered by the user in add user modal to the addUser function
admin_route.post('/admin/add-user', adminController.addUser);

//it will send the id of the user as path params to the deleteUser function
admin_route.post('/admin/delete-user/:id', adminController.deleteUser)

//it will send the updated data to the server to save the data in the database
admin_route.post('/admin/update-user', adminController.updateUser);

//it will search the data based on the input field and show the answer, It is using query params to give the proper answer.
admin_route.get('/admin/search-users', adminController.searchUser)

//it will distory the session of the admin and logout the user to the '/' page.
admin_route.get('/admin/logout', adminController.logoutAdmin)


module.exports = admin_route