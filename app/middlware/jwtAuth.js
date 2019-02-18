const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
    }
    if (req.token) {

        jwt.verify(req.token, process.env.APP_SECRET, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.user = decoded.user;
                next();
            }
        });

    }else{
        next();
    }
}