const User = require("../models/User");
const generateToken = require("../utils/generateToke");
const generateRefreshToken = require("../utils/refreshToken");
const asyncHandler = require("express-async-handler");
const validateId = require("../utils/validateMongoID");
const jwt = require('jsonwebtoken');

const register = asyncHandler(async (req, res) => {
        const email = req.body.email;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create(req.body)

        const token = generateToken(user);

        res.status(201).json({ token, message: 'User created successfully' });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            throw new Error('User does not exist');
        }
        const refreshToken = generateRefreshToken(user);
        const updateUser = await User.findByIdAndUpdate(
            user.id,
            {
                refreshToken: refreshToken,
            },
            {
                new: true,
            }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 72*60*60*1000,
        })

        const token = generateToken(user);

        res.status(202).json({ token, message: 'Login successful' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find().select('-password');
        res.status(200).json(getUsers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateId(id);
    try {
        const getUser = await User.findById(id).select('-password');
        res.status(200).json(getUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateId(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id).select('-password');
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateId(id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password, 
            },
            {
                new: true, 
                runValidators: true, 
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    try {
        const blockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true, 
            },
            {
                new: true, 
                runValidators: true, 
            }
        ).select('-password');

        if (!blockUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({message: "User blocked",blockUser});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    try {
        const unblockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false, 
            },
            {
                new: true, 
                runValidators: true, 
            }
        ).select('-password');

        if (!unblockUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({message: "User unblocked",unblockUser});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) throw new Error("No refresh Token");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) throw new Error("Refresh token doesnt match with the db");

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
        if (err || user.id !== decode.id) throw new Error("There is something wrong with refresh token");
        
        const accressToken = generateToken(user);
        res.json({ accressToken });
    })
});

const logOut = asyncHandler(async (req, res) => { 
    const cookie = req.cookies;

    if (!cookie?.refreshToken) throw new Error("No refresh Token");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }

    await User.findByIdAndUpdate(user.id, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
    res.sendStatus(204).json({message: "Logout sucessfully"});
});


module.exports = {
    register,
    login,
    logOut,
    getAllUsers,
    getaUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken
};