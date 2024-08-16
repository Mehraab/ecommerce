const express = require('express');
const { register, login, getAllUsers, getaUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logOut, updatePassword, resetPasswordToken, resetPassword } = require('../controller/userController');
const { protect, admin } = require('../middlewares/auth');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logOut);
router.get('/refresh', handleRefreshToken);
router.post('/reset-password-token', resetPasswordToken);
router.put('/reset-password/:token', resetPassword);

router.put('/password', protect, updatePassword);
router.get('/getAllUsers',protect, admin, getAllUsers);
router.get('/getauser',protect, getaUser);
router.delete('/delete', protect, deleteUser);
router.put('/edituser', protect, updateUser);
router.put('/block/:id',protect, admin, blockUser);
router.put('/unblock/:id', protect, admin, unblockUser);

module.exports = router;