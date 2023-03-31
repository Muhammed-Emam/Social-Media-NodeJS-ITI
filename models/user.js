// import Mongoose for MongoDB interaction
const mongoose = require('mongoose');

// import bcrypt for password encryption
const bcrypt = require('bcrypt');

// assign Schema constructor from mongoose to a variable
const Schema = mongoose.Schema;

// import lodash for data manipulation
const _ = require('lodash');

// import saltRound constant from config file
const {saltRound} = require('../config/config');

// define user schema using the Schema constructor
const userSchema = new Schema({
    // username string is required and must be unique
    username:{
        type:String,
        required:true,
        unique:true
    },
    // age number is optional
    age:Number,
    // password string is required
    password:{
        type:String,
        required:true,
    },
    // role string is required, has predefined values, and defaults to 'user'
    role: {
        type: String,
        enum: ["admin", "creator", "user"],
        required: true,
        default: "user",
      },
    },{
        // toJSON option specifies transformation of the return object
        toJSON:{
            transform: (doc,ret)=>{
                //pick only selected fields to return 
                const dataToReturn = _.pick(ret,['_id','username','age']);
                return dataToReturn;
            }
        }
    });

// pre-save hook that hashes the password if it is modified
userSchema.pre('save',async function(next){
    const userDocument = this;
    if(userDocument.isModified('password')){
        const hashedPassword = await bcrypt.hash(userDocument.password,saltRound);
        userDocument.password = hashedPassword;
    }
    next();
})

// method to compare supplied password and hashed password
userSchema.methods.comparePassword = function (password){
    const userDocument = this;
    return bcrypt.compare(password,userDocument.password);
}

// create User model from user schema with mongoose.model()
const User = mongoose.model('User',userSchema);

// export User model so that it can be used in other modules
module.exports = User;
