const express = require('express');
const { register, login, getAllUsers, getaUser, deleteUser, updateUser, blockUser, unblockUser } = require('../controller/userController');
const { protect, admin } = require('../middlewares/auth');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/getAllUsers',protect,admin, getAllUsers);
router.get('/getauser',protect, getaUser);
router.delete('/delete', protect, deleteUser);
router.put('/edituser', protect, updateUser);
router.put('/block/:id',protect, admin, blockUser);
router.put('/unblock/:id',protect, admin, unblockUser);

module.exports = router;