const express = require('express');
const {
  getPosts,
  createPost,
  postsByUsers,
  postById,
  singlePost,
  isPoster,
  deletePost,
  updatePost,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  updateComment
} = require('../controllers/post');
const { createPostValidator } = require('../validator');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router = express.Router();

router.get('/posts', getPosts);

router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);
router.put('/post/updatecomment', requireSignin, updateComment);

router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
router.get('/posts/by/:userId', requireSignin, postsByUsers);
router.get('/post/:postId', singlePost);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

router.get('/post/photo/:postId', photo);

// any route containing :userId, our app will first execute userByßId()
router.param('userId', userById);
// any route containing :postId, our app will first execute postById()
router.param('postId', postById);
module.exports = router;
