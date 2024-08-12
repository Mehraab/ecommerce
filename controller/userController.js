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
    const { id } = req.params;
    try {
        const getUser = await User.findById(id).select('-password');
        res.status(200).json(getUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            firstname: req?.params?.firstname,
            lastname: req.params.lastname,
            email: req?.params?.email,
            mobile: req?.params?.mobile,
            password: req?.params?.password
        },
        {
            new: true
        });
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = { register, login, getAllUsers, getaUser, deleteUser, updateUser};