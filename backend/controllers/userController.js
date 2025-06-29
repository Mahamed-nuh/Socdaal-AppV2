const express = require('express');
const User = require('../models/userModel'); // <-- No destructuring, just User
const jwt = require('jsonwebtoken');


// Create a JWT token
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, { expiresIn: '3d' });
}

// Login user
const loginUser = async (req, res) =>{
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        
        // Create a token
        const token = createToken(user._id);
        res.status(200).json({ email: user.email, userName: user.userName, token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

// Signup user
const signupUser = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const user = await User.signup(userName, email, password);
        // Create a token
        const token = createToken(user._id);
        res.status(200).json({ email: user.email, userName: user.userName, token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    signupUser,
    loginUser
};