
// it will check that user is exists or not. 

// if not it will redirect to the login page.
const is_UserLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            next();
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        console.log(error.message);
    }
}

//if exists it will redirect to the home page.
const is_UserLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/user/home');
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}

// it will check that admin is exists or not. 

//if not exists it will redirect to the login page.
const is_AdminLogin = async (req, res, next) => {
    try {
        if (req.session.isAdmin) {
            next();
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.log(error.message);
    }
}

//if exists it will redirect to the admin dashboard
const is_AdminLogout = async (req, res, next) => {
    try {
        if (req.session.isAdmin) {
            res.redirect('/admin/dashboard');
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    is_UserLogin,
    is_UserLogout,
    is_AdminLogin,
    is_AdminLogout
}
