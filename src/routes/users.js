const express = require('express')
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();

const secret = process.env.REACT_APP_SECRET

router.route('/register')
    .post(async (req, res) => {
        try {
            const {email, username, password} = req.body;
            const user = new User({email, username});
            const registeredUser = await User.register(user, password);
            const token = jwt.sign({userId: registeredUser._id}, secret, {expiresIn: '1h'});
            const data = {user: registeredUser._id, token}
            return res.status(200).json({message: 'Registration successful', registerData: data});
        } catch (err) {
            console.log(`Error: ${err.message}`);
            return res.status(500).json({error: err.message});
        }
    })

router.route('/login')
    .post(passport.authenticate('local', {
        failureFlash: true, failureRedirect: '/login', keepSessionInfo: true
    }), (req, res) => {
        try {
            const token = jwt.sign({userId: req.user._id}, secret, {expiresIn: '1h'});
            const data = {user: req.user._id, token}
            return res.status(200).json({message: 'Logged In', data});
        } catch (err) {
            console.log(`Error: ${err.message}`);
            return res.status(500).json({error: err.message});
        }
    });

module.exports = router