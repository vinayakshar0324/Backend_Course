const user = require('../models/user');
const BigPromise = require('./bigPromise');
const CustomError = require('../utils/customError');
const jwt = require('jsonwebtoken');

exports.isLoggedIn = BigPromise(async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization").replace('Bearer', "");

    if(!token){
        return next(new CustomError('Login First to Access This page', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();

});

exports.customRole = (...roles) => {
    return(req, res, next)  => {
        if(!roles.includes(req.user.role)){
            return next(new CustomError('You are not allowed for these resource', 403))
        }
        next()
        if(req.user.role === 'admin'){
            next()
        }
    }
}