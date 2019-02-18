var authenticatedOnly = require('./authenticatedOnly');

module.exports = [authenticatedOnly,function(req,res,next){
    if(!req.user.admin){
        return res.status(403).send({ 
            success: false, 
            message: 'Unauthorized' 
        });
    }else{
        next();
    }
}]