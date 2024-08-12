const User = require("../models/User");
const generateToken = require("../utils/generateToke");
const asyncHandler = require("express-async-handler")

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
    try {
        const getUser = await User.findById(id).select('-password');
        res.status(200).json(getUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    try {
        const deleteUser = await User.findByIdAndDelete(id).select('-password');
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
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


module.exports = {
    register,
    login,
    getAllUsers,
    getaUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser
};