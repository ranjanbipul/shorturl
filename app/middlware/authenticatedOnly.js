module.exports = function(req,res,next){
    if(req.user===undefined){
        return res.status(401).send({ 
            success: false, 
            message: 'Unauthenticated user' 
        });    
    }else{
        next();
    }
}