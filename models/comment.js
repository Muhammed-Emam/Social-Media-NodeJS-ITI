const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
		comment_body:{
			type:String,
			required:true,
            min: 1
		},
		user:{
			type:Schema.Types.ObjectId,
			required:true,
			ref:'User'
		},
		post: { 
			type: Schema.Types.ObjectId,
			ref: "Post",
            required:true
		}

})

const Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;