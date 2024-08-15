const User = require("../models/User");
const validateId = require("../utils/validateMongoID");

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
 
module.exports = {
    updatePassword
}