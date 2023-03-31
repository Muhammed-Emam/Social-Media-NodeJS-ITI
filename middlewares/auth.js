const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../models/user');
const {jwtSecret} = require('../config/config.env')
const customError = require('../utils/customError');
const verifyJwt = promisify(jwt.verify);

exports.protect= async (req,res,next)=>{
	try{
		//  extract token from headers
		const token = req.headers.authorization;
		if(!token){
			const error = new Error('unauthorized');
			error.statusCode = 401;
			return next(error)
		}
		//  verify the token (secret)
		const {id} = await verifyJwt(token,jwtSecret);
		// find user by id
		const user = await User.findById(id);
		if(!user){
			const error = new Error('unauthorized');
			error.statusCode = 401;
			return next(error)
		}
		//  attach user to request body
		req.user = user;
		next();	
	}catch(err){
		console.log(err)
		next(err)
	}
}
// Grant access to specific roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
	  if (!roles.includes(req.user.role)) {
		return next(
		  new customError(
			`User role ${req.user.role} is not authorized to access this route`,
			403
		  )
		);
	  }
	  next();
	};
};
