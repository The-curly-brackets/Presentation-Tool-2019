// TODO: Hide it in a env variable.
const secret = "frenchfriestastegood!";
const jwt = require('jsonwebtoken');

const checkToken = function (req, res, next) {
    let token = req.headers['authorization'];

    if(token){
        try{
            logindata = jwt.verify(token, secret);
            next();
        }
        catch(err){
            res.status(403).json({msg: "Not a valid token"});
        }
    }else{
        res.status(403).json({msg: "Not token"});
    }
};

module.exports = checkToken;