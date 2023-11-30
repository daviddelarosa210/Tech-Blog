// controllers/userController.js
const { User } = require('../models');

const userController = {
  getLoginPage: (req, res) => {
    res.render('login');
  },

  loginUser: async (req, res) => {
    // Logic for user login
  },

  getSignupPage: (req, res) => {
    res.render('signup');
  },

  signupUser: async (req, res) => {
    // Logic for user signup
  },

  logoutUser: (req, res) => {
    // Logic for user logout
  },

  ensureAuthenticated: (req, res, next) => {
    // Middleware to check if the user is authenticated
    next();
  },
};

module.exports = userController;
