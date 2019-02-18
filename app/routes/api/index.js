var express = require('express')
var router = express.Router();
var accountRoute = require('./account');
var userRouter = require('./user');
var redirectRouter = require('./redirect');

router.use('/account',accountRoute);
router.use('/users',userRouter);
router.use('/redirects',redirectRouter);

module.exports = router;