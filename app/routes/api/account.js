var express = require('express');
var router = express.Router();
var validator = require('validator');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../../models/user');


router.post('/register', function (req, res, next) {
    let hasError = false;
    let errors = {};
    if (req.body.username === undefined || !validator.isAlphanumeric(req.body.username)) {
        hasError = true;
        errors["username"] = "Username must only contain Alphanumeric character";
    }
    if (req.body.name === undefined || !validator.matches(req.body.name, /[A-Za-z]+( [A-Za-z]+)?( [A-Za-z]+)?/i)) {
        hasError = true;
        errors["name"] = "Invalid Name";
    }
    if (req.body.password === undefined || validator.isEmpty(req.body.password)) {
        hasError = true;
        errors["password"] = "Password can't be empty";
    }
    if (hasError) {
        res.json({
            success: false,
            errors: errors,
            message: "Invalid user registration details"
        });
    } else {
        next();
    }
}, function (req, res) {
    bcrypt.hash(req.body.password, parseInt(process.env.APP_SALT_ROUND)).then(function (hash) {
        let user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hash,
            admin: false
        });


        user.save(function (err) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Error in creating user',
                    errors: err
                });
            } else {
                res.json({
                    success: true,
                    message: 'Registration successfull'
                });
            }
        });
    });
});

router.post('/auth', function(req,res,next){
    let hasError = false;
    let errors = {};
    if (req.body.username === undefined || !validator.isAlphanumeric(req.body.username)) {
        hasError = true;
        errors["username"] = "Invalid username";
    }
    if (req.body.password === undefined || validator.isEmpty(req.body.password)) {
        hasError = true;
        errors["password"] = "Invalid password";
    }
    if (hasError) {
        res.json({
            success: false,
            errors: errors,
            message: "Invalid login details"
        });
    } else {
        next();
    }
},
function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.',
                errors: {
                    username: "Invalid user"
                }
            });
        } else if (user) {
            // check if password matches
            bcrypt.compare(req.body.password, user.password).then((resp)=> {
                if(resp){
                    const payload = {
                        user: {
                            id: user._id,
                            username: user.username,
                            name: user.name,
                            admin: user.admin
                        }
                    };
                    var token = jwt.sign(payload, process.env.APP_SECRET, {
                        expiresIn: 1440*60 // expires in 24 hours
                    });
    
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Login Successfull',
                        data: {
                            token: token,
                            user: {
                                name: user.name
                            }
                        }
                    });
                }else{
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.',
                        errors: {
                            password: 'Invalid Password'
                        }
                    });
                }
            });
        }

    });
});

module.exports = router;