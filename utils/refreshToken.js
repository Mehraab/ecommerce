const jwt = require('jsonwebtoken');

const generateRefreshToken = (user) => {
    const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '3d', // Token expires in 1 hour
    });
};

module.exports = generateRefreshToken;