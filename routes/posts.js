
const express = require('express');
const {
    getPosts,
    getPost,
    addPost,
    updatePost,
    deletePost
} = require('../controllers/post');

const Review = require('../models/post');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

router
  .route('/')
  .get(getPosts)
  .post(protect, authorize('creator'), addPost);

router
  .route('/:id')
  .get(getPost)
  
.put(protect, authorize('creator'), updatePost)
  .delete(protect, authorize('creator', 'admin'), deletePost);

