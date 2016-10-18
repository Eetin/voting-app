const express = require('express');
const authRouter = express.Router();
const passport = require('../auth');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const User = require('../models/user');

authRouter.get('/login/facebook',
  passport.authenticate('facebook', { scope: [ 'email' ], display: 'popup' })
);

authRouter.get('/login/facebook/return',
    passport.authenticate('facebook', {
        failureRedirect: '/login' }),
        (req, res) => {
            const email = req.user.emails[0].value;
            const name = req.user.displayName;
            const photo = req.user.photos[0].value;
            
            User.findOrCreate({ email },
                { userId: uuid.v4(), name, email, photo }, (err, user) => {
                if (!err) {
                    res.cookie('accessToken',
                    jwt.sign(user.userId, process.env.JWT_SECRET),
                    { secure: true, httpOnly: true });
                    res.redirect('/login_success?authenticated=true');
                } else {
                    res.redirect('/login');
                }
            });
        });

authRouter.get('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.end();
});

module.exports = authRouter;