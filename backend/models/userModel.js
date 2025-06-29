const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// static signup method
userSchema.statics.signup = async function (userName, email, password) {
    // validation
    if (!email || !password || !userName) {
        throw Error('All fields must be filled');
    }
    if (!email.includes('@')) {
        throw Error('Email is not valid');
    }
    if (password.length < 6) {
        throw Error('Password must be at least 6 characters long');
    }
    // check if user already exists
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already in use');
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create user
    const user = await this.create({userName, email, password: hash });

    return user;

}

// static login method
userSchema.statics.login = async function (email, password) {
    // validation
    if (!email || !password) {
        throw Error('All fields must be filled');
    }
    // check if user exists
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }
    // check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
}

const User = mongoose.model('User', userSchema);
module.exports = User;