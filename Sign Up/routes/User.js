const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/User");

// Signup
router.get("/signup", UserController.renderSignupForm);
router.post("/signup", UserController.signup);
router.get("/verify-otp", UserController.renderVerifyOtp);
router.post("/verify-otp", UserController.verifyOtp);
// Login
router.get("/login", UserController.renderLoginForm);
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureMessage: true,
    }),
    UserController.login
);

// Logout
router.get("/logout", UserController.logOut);



router.get("/model", (req, res) => {
    res.render("model", {user:req.user});   // this will look for views/model.ejs
});


module.exports = router;
