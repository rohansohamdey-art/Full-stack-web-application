const User = require("../models/user.js");

// ==================== SIGNUP PAGE ====================

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


// ==================== SIGNUP ====================

module.exports.signup = async (req, res, next) => {

    try {

        let { username, email, password } = req.body;

        const newUser = new User({
            email,
            username
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        console.log(registeredUser);

        req.login(registeredUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome!");

            return res.redirect("/listings");
        });

    } catch (e) {

        req.flash("error", e.message);

        return res.redirect("/signup");
    }
};


// ==================== LOGIN PAGE ====================

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


// ==================== LOGIN ====================

module.exports.login = (req, res) => {

    req.flash("success", "Welcome back!");

    const redirectUrl =
        res.locals.redirectUrl || "/listings";

    return res.redirect(redirectUrl);
};


// ==================== LOGOUT ====================

module.exports.logout = (req, res, next) => {

    req.logout((err) => {

        if (err) {
            req.flash("error", err.message);
            return res.redirect("/listings");
        }

        req.flash("success", "Logged you out!");

        return res.redirect("/listings");
    });
};