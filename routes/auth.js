const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
  //information to request from google after authentication passes
}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }), (req, res) => {
    // Successful authentication, redirect home. 
    res.redirect('/dashboard');
  }
);

module.exports = router;
