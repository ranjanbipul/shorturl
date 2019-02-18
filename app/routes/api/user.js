var express = require('express')
var router = express.Router()
var User = require('../../models/user');
var adminOnly = require('../../middlware/adminOnly');

router.use(adminOnly);

router.get('/', function(req, res) {
    User.find({}, function(err, users) {
      res.json({
        success: true,
        data: users
      });
    });
}); 

module.exports = router