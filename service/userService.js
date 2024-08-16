const { sendMail } = require("../controller/emailController");
const User = require("../models/User");
const validateId = require("../utils/validateMongoID");
const crypto = require('crypto');

const updatePassword = async (req) => {
    try {
        const { id } = req.user;
        validateId(id);
        const { password } = req.body;
        const user = await User.findById(id);
        console.log(password);
        if (password) {
            user.password = password;
            const updatedPassword = await user.save();
            return updatedPassword;
        }
        else {
            return user;
        }
    }
    catch (err) {
        throw new Error(err.message);
    }
};

const resetPassToken = async (req) => { 
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error("User deos not exist");
        const token = await user.createPasswordResetToken();
        user.save();
        const resetURL = `Hi, please follow this link to reset your password.This link is valid till 10 mins from now.
                         <a href='http://localhost:5000/reset-password/${token}'>Click here</a>`;
        const data = {
            to: email,
            text: "Hello from Mehrabs ecommerce",
            subject: "Reset password link",
            htm: resetURL,
        };
        sendMail(data);
        return token;
    }
    catch (err) {
        throw new Error(err.message);
    }
};

const resetPass = async (req) => { 
    try {
        const { password } = req.body;
        const { token } = req.params;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne(
            {
                passwordResetToken: hashedToken,
                passwordResetTokenExpires: { $gt: Date.now() },
            }
        );
        if (!user) throw new Error("User deos not exist");
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save();

        return user;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
 
module.exports = {
    updatePassword,
    resetPassToken,
    resetPass
}