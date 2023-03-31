
const customError = require('../utils/customError');
const asyncHandler = require('../middlewares/async');
const Post = require('../models/Post');
const User = require('../models/User');
// @desc      Get posts
// @route     GET /api/v1/posts
// @route     GET /api/v1/posts
// @access    Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  if (req.params.post) {
		const posts = await Post.find({user:req.user._id}).populate('user');
    return res.status(200).json({
      success: true,
    });
  
  }
});

// @desc      Get single post
// @route     GET /api/v1/posts/:id
// @access    Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(
      new customError(`No posts found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc      Add post
// @route     POST /api/v1/posts
// @access    Private
exports.addPost = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const post = await Post.create(req.body);

  res.status(200).json({
    success: true
  });
});

// @desc      Update post
// @route     PUT /api/v1/posts/:id
// @access    Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new customError(`No post with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure post belongs to user or user is admin
  if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new customError(`Not authorized to update post`, 401));
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  post.save();

  res.status(200).json({
    success: true
  });
});

// @desc      Delete post
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new customError(`No post with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure posts belongs to user or user is admin
  if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new customError(`Not authorized to update post`, 401));
  }

  await post.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});