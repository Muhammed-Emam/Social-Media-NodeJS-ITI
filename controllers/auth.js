const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {promisify} = require('util');
const {protect, authorize} = require('../middlewares/auth');
const signJwt = promisify(jwt.sign);
const {jwtSecret} = require('../config/config.env')
const customError = require('../utils/customError');
const asyncHandler = require('../middlewares/async');

//checking all fields are entered
const checkRequiredFields = (params)=>(req,res,next)=>{
	const receivedParams = Object.keys(req.body);
	const missingParams = params.filter(param=>!receivedParams.includes(param))
	if(missingParams.length)throw new CustomError(`missing params ${missingParams.join(',')}`,400)

}
// This is to register user and is public
exports.register = asyncHandler(async (req, res, next) => {
    try{
		const {username,age,password,role} = req.body;
		if (!username || !age || !password || !role) {
            return res.json({ message: 'Please enter all the details' })
        }

        //Check if the user already exists or not
        const userExist = await User.findOne({ username: req.body.username });
        if (userExist) {
            return res.json({ message: 'User already exist with the given username' })
        }

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;

        const newUser = new User(req.body);
        await newUser.save();
        res.send(newUser);
        const token = await jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        return res.cookie({ 'token': token }).json({ success: true, message: 'User registered successfully', data: newUser })
    } catch (error) {
        return res.json({ error: error });
    }
    });

// this is to log in users
exports.login = asyncHandler(async (req, res, next) => {
  try {
        const { username, password } = req.body;
        //Check emptyness of the incoming data
        if (!username || !password) {
            return res.json({ message: 'Please enter all the details' })
        }
        //Check if the user already exists or not
        const userExist = await User.findOne({username: req.body.username});
        if(!userExist){
            return res.json({message:'Wrong credentials'})
        }
        //Check password match
        const isPasswordMatched = await bcrypt.compare(password,userExist.password);
        if(!isPasswordMatched){
            return res.json({message:'Wrong credentials pass'});
        }
        const token = await jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        return res.cookie({"token":token}).json({success:true,message:'LoggedIn Successfully'})
    } catch (error) {
        return res.json({ error: error });
    }

})

// this is to logout users
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// get the logged-in user
exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user
  });
});

// update the user
exports.updateUser = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    age: req.body.age,
    role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});
