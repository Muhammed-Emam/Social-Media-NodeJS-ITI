// import required modules/packages
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../models/user');
const {jwtSecret} = require('../config/config.env')
const customError = require('../utils/customError');
// promisify jsonwebtoken verify function
const verifyJwt = promisify(jwt.verify);

// protect routes by verifying token and attaching user to request object
exports.protect= async (req,res,next)=>{
    try{
        // extract token from headers
        const token = req.headers.authorization;
        if(!token){
            // if token is not provided, throw error with status code 401
            const error = new Error('unauthorized');
            error.statusCode = 401;
            return next(error)
        }
        // verify the token using jwtSecret
        const {id} = await verifyJwt(token,jwtSecret);
        // find user by id
        const user = await User.findById(id);
        if(!user){
            // if user is not found, throw error with status code 401
            const error = new Error('unauthorized');
            error.statusCode = 401;
            return next(error)
        }
        // attach user to request body
        req.user = user;
        next(); 
    }catch(err){
        console.log(err)
        next(err)
    }
}

// authorize specific roles to access certain routes
exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        // if user role is not authorized, throw an error with status code 403
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
