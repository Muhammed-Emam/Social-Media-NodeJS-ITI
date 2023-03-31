const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
		review_body:{
			type:String,
			required:true,
            min: 1
		},
        rating:{
			type:Number,
			required:true,
            min: 1,
            max: 10
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
// to make sure each user only submits one review per post
reviewSchema.index({ post: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;