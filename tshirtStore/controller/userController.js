const User = require('../models/user');
const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const mailHelper = require('../utils/emailHelper');
const crypto = require('crypto');



exports.signup = BigPromise(async ( req, res, next) => {

    if(!req.files){
        return next(new CustomError("photo is required for signup", 400));

    }

    const {name, email, password} = req.body
   
    if(!email || !name || !password){
        return next(new CustomError('Name, Email, PASSWORD is required', 400));
    }



    let file = req.files.photo


        result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "user",
            width: 150,
            crop: "scale",

        })
    




  
    const user = await User.create({
        name,
        email,
        password,
        photo:{
            id: result.public_id,
            secure_url: result.secure_url
        },
    })

   cookieToken(user, res);

});



exports.login = BigPromise(async (req, res, next) => {
    const {email, password} = req.body

    // check for email password
    if(!email || !password ){
        return next(new CustomError('please provide email and password '), 400);
    }

    //get user from DB
    const user = await User.findOne({email}).select("+password");

    //if user not found in DB
    if(!user){
        return next(new CustomError("You are not registered"), 400);
    }

    // match the password
    const isPasswordCorrect = await user.isValidatedPassword(password);
    //if password do not match
    if(!isPasswordCorrect){
        return next(new CustomError("Email or password does not match"), 400);
    }
    // cookie token
    cookieToken(user, res);

});



exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true 
    })
    res.status(200).json({
        success: true,
        message: "Logout success"
    });
    
});


exports.forgotPassword = BigPromise(async (res, req, next) => {
    const {email} = req.body

   const user = await User.findOne({email})

    if(!user){
        return next(new CustomError('Email not found as regisred', 400));
    }



   const forgotToken = user.getForgotToken()

    await user.save({validateBeforeSafe: false})

    const myUrl = `${req.protocol}://${req.get("host")}/password/reset/${forgotToken}`

    const message = `Cpoy paste this link in your url and hit enter \n\n ${myUrl}`

    try {
        await mailHelper({
            email: user.email,
            subject: "password reseet email",
            message, 
        })
        res.status(200).json({
            success: true,
            message: "email sent successfully"
        })
    } catch (error) {
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined
        await user.save({validateBeforeSafe: false})

        return next(new CustomError(error.message, 500));
    }


});



exports.passwordReset = BigPromise(async (req, res, next) => {
    const token = req.params.token

    const encryToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

   const user = await User.findOne({encryToken, 
        forgotPasswordExpiry: {$gt: Date.now()}
    })

    if(!user){
        return next(new CustomError('Token is invalid or expire', 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new CustomError('password and confirm password do not match', 400));
    
    }

    user.password = req.body.password

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined   


    await user.save();


    //send a json response or token 
    cookieToken(user, res);
});


exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    

   const user = await User.findById(req.user.id);

   res.status(200).json({
       success: true,
       user, 
   })

});



exports.changePassword = BigPromise(async(req, res, next) => {
    const userID = req.user.id

    const user = await User.findById(userID).select("+password")

    const isCorrectOldPassword = await user.isValidatedPassword(req.body.oldPassword)

    if(!isCorrectOldPassword){
        return next(new CustomError('old passowrd is incoorect', 400))
    }

    user.password = req.body.password

    await user.save()


    cookieToken(user, res);

});



exports.updateUserDetails = BigPromise(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email
    };

    if(req.files.photo !== ''){
       const user = await User.findById(req.user.id)


       const imageId = user.photo.id
    

       //delete photo on cloudnairy
        const resp = await cloudinary.v2.uploader.destroy(imageId)

        const result = await cloudinary.v2.upload(file.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        });


        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }



    }


    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    })

    res.status(200).json({
        success: true,
        user
    })


});


exports.adminAllUser = BigPromise(async(req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users,
    })

});


exports.managerAllUser = BigPromise(async(req, res, next) => {
    const user = await User.findOne({role: 'user'})

    res.status(200).json({
        success: true,
        users,
    })
});


exports.adminSingleUser = BigPromise(async(req, res, next) => {
    const user = await User.findById(eq.params.id);

    if(!user){
        next(new CustomError('No User Found', 400));
    }


    res.status(200).json({
        success: true,
        user
    });

});