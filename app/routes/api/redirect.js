var express = require('express')
var router = express.Router();
var shortid = require('shortid');
var validator = require('validator');
var Redirect = require('../../models/redirect');
var authenticatedOnly = require('../../middlware/authenticatedOnly');

router.use(authenticatedOnly);

router.get('/', function(req, res) {
    Redirect.find({user: req.user.id}, function(err, redirects) {
      return res.json({
          success: true,
          data: redirects
      });
    });
});

router.post('/', function(req, res,next) {
    let hasError = false;
    let errors = {};
    if (req.body.url === undefined || !validator.isURL(req.body.url)) {
        hasError = true;
        errors["url"] = "Invalid URL";
    }
    if (hasError) {
        res.json({
            success: false,
            errors: errors,
            message: "Something went wrong"
        });
    } else {
        next();
    }
},function(req,res){
    let redirect = new Redirect({
        user: req.user.id,
        originalUrl: req.body.url,
        shortId: shortid.generate(),
    });
    redirect.save(function(err,obj){
        if (err) {
            res.json({
                success: false,
                message: 'Error in creating short url',
                errors: err
            });
        } else {
            res.json({
                success: true,
                message: 'Created',
                data: obj
            });
        }
    });
});

module.exports = router