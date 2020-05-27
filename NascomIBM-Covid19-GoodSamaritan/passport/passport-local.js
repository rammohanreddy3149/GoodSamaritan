'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    
    User.findOne({'email': email}, (err, user) => {
       if(err){
           return done(err);
       }
        
        if(user){
            //console.log('incorrect');
            return done(null, false, req.flash('error', 'User with email already exist'));
        }
        
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.type=req.body.type;
        newUser.designation=req.body.designation;
        newUser.password = newUser.encryptPassword(req.body.password);
        
        newUser.save((err) => {
            done(null, newUser);
        });
    });
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    
    User.findOne({'email': email}, (err, user) => {
        if(err){
           return done(err);
        }
        
        const messages = [];
        if(!user || !user.validUserPassword(password)){
            messages.push('Email Does Not Exist or Password is Invalid');
            return done(null, false, req.flash('error', messages));
        }
        
        return done(null, user);
    });
}));
passport.use('local.group', new LocalStrategy({
    nameField: 'name',
    passcodeField: 'passcode',
    passReqToCallback: true
}, (req, name, passcode, done) => {
    
    User.findOne({'name': name}, (err, user) => {
        if(err){
           return done(err);
        }
        
        const messages = [];
        if(!user || !user.validUserPasscode(passcode)){
            messages.push('Password is Invalid');
            return done(null, false, req.flash('error', messages));
        }
        
        return done(null, user);
    });
}));