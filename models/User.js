const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const emailValidator = function (value) {
    const emailRegx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegx.test(value);
};

const emailErrorMessage = function (props) {
    return `${props.value} is not a valid email!`;
};

const emailValidate = {
    validator: emailValidator,
    emailErrorMessage: emailErrorMessage
};
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    lastname:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type: String,
        validate: emailValidate,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        required: true,
        enum:['admin', 'customer']
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

//Hashed password before saving 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password and hashed password in the database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Export the model
module.exports = mongoose.model('User', userSchema);