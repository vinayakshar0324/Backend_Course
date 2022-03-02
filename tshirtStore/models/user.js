const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name'],
        maxlength: [40, 'name should be under 40 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide the name'],
        validate: [validator.isEmail, 'Please enter email in correct format'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please Provide the Password'],
        minlength: [6, 'password should be atleast 6 chars'],
        select: false,
    },
    role: {
        type: String,
        default: 'user',

    },
    photo: {
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
        
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    },
});


// encrypt passowrd before save - HOOKS
userSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});

//validate the password with passed on user password
userSchema.methods.isValidatePassword = async function(usersendPassword){
   return await  bcrypt.compare(usersendPassword, this.password)
};


//create and return jwt token
userSchema.methods.getJwtTokens = function(){
    jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

//generate forgot password token
userSchema.method.forgetPasswordToken = function(){
    //genrate long random string
    const forgetToken = crypto.randomBytes(20).toString('hex');

    //getting a hash - make sure to get a hash on backend
    this.forgetPasswordToken = crypto.createHash('sha256').update(forgetToken).digest('hex')

    //time
    this.forgetPasswordExpiry = Date.now() + 20 *60 * 1000

    return forgetToken;

}


module.exports = mongoose.model('User', userSchema);

