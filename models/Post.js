const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
		Desc:{
			type:String,
			required:true,
			unique:true
		},
		user:{
			type:Schema.Types.ObjectId,
			required:true,
			ref:'User'
		}
})

const Post = mongoose.model('Post',postSchema);
module.exports = Post;