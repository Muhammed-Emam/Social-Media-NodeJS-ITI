// import Joi for schema validation
const Joi = require("joi");

// define schema for login validation using Joi
const loginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

// middleware function to validate sign-in credentials
const validateSignin = (req,res,next)=>{
    // use the loginSchema to validate request body
    const {error} = loginSchema.validate(req.body);
    if(error){
        // if error exists, throw an error with status code 400
        const err = new Error(error.details[0].message);
        err.statusCode = 400;
        return next(err)
    }
    next();
}

// export validateSignin middleware function
module.exports = {
    validateSignin
}
