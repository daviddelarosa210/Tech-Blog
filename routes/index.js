// routes/index.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

// Home routes
router.get('/', homeController.getHomePage);

// User authentication routes
router.get('/login', userController.getLoginPage);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));
router.get('/signup', userController.getSignupPage);
router.post('/signup', userController.signupUser);
router.get('/logout', userController.logoutUser);

// Dashboard routes
router.get('/dashboard', userController.ensureAuthenticated, postController.getDashboard);
router.post('/dashboard/add', userController.ensureAuthenticated, postController.addPost);
router.get('/dashboard/edit/:postId', userController.ensureAuthenticated, postController.getEditPost);
router.post('/dashboard/edit/:postId', userController.ensureAuthenticated, postController.editPost);
router.post('/dashboard/delete/:postId', userController.ensureAuthenticated, postController.deletePost);

// Post routes
router.get('/post/:postId', postController.getPost);
router.post('/post/:postId/comment', userController.ensureAuthenticated, postController.addComment);

module.exports = router;
