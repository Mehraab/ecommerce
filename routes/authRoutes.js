const express = require('express');
const { register, login, getAllUsers, getaUser, deleteUser, updateUser } = require('../controller/userController');
const { protect, admin } = require('../middlewares/auth');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/getAllUsers',admin, getAllUsers);
router.get('/:id',protect, getaUser);
router.delete('/:id', protect, deleteUser);
router.put('/:id',protect, updateUser);

module.exports = router;