// import Mongoose for MongoDB interaction
const mongoose = require('mongoose');

// assign Schema constructor from mongoose to a variable
const Schema = mongoose.Schema;

// define post schema using the Schema constructor
const postSchema = new Schema({
    // post description string is required and must be unique
    Desc:{
        type:String,
        required:true,
        unique:true
    },
    // user id as Object ID, which is required and references the User collection
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})

// create Post model from post schema with mongoose.model()
const Post = mongoose.model('Post',postSchema);

// export Post model so that it can be used in other modules
module.exports = Post;
