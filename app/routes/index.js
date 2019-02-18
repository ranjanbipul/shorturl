var express = require('express')
var router = express.Router()
var apiRoute = require('./api');
var Redirect = require('../models/redirect')

router.use('/api', apiRoute);
router.get('/:shortId', function(req, res){
    Redirect.findOneAndUpdate({shortId: req.params.shortId},{$inc: {hits: 1}},(err,redirect)=>{
        if(err){
            throw err;
        }else if (!redirect){
            return res.status(404).send("Not found");
        }else{
            return res.redirect(redirect.originalUrl);
        }
    })
});

module.exports = router;