'use strict';

module.exports = function(){
    return {
        EnterValidation: (req, res, next) => {
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('password', 'Password must not be less than 5').isLength({min: 5});

            req.getGroupResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                    req.flash('error', messages);
                    res.redirect('/home');
                })
                .catch((err) => {
                    return next();
                })
        }
    }
}