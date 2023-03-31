// import Mongoose for MongoDB interaction
const mongoose = require('mongoose');

// assign Schema constructor from mongoose to a variable
const Schema = mongoose.Schema;

// define comment schema using the Schema constructor
const commentSchema = new Schema({
    // comment body string is required and must be at least 1 character long
    comment_body:{
        type:String,
        required:true,
        min: 1
    },
    // user id as Object ID, which is required and references the User collection
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    // post id as Object ID, which is required and references the Post collection
    post: { 
        type: Schema.Types.ObjectId,
        ref: "Post",
        required:true
    }
})

// create Comment model from comment schema with mongoose.model()
const Comment = mongoose.model('Comment',commentSchema);

// export Comment model so that it can be used in other modules
module.exports = Comment;
