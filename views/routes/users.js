const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req,res)=>{
    req.flash('success','welcome');
    console.log(req.flash('success'));
    res.render('./users/register');
    
})
router.post('/register',catchAsync(async (req, res) => {
    try {
        const { email, username, password, role } = req.body;
        const user = new User({ email, username,role });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success', 'Welcome to HoMan!');

            res.redirect('/');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
} 
))

router.get('/login', (req,res)=>{
    res.render('./users/login');
})
router.post('/login',passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),(req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/students';
    delete req.session.returnTo;
    console.log(req.flash('success'));
    res.redirect(redirectUrl);
})
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            console.error('Logout error:', err);
        }
        req.flash('success', 'Goodbye');
        res.redirect('/students');
    });
});

module.exports = router;