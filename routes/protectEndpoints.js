const badWolf = require('../modules/badWolf');
const jwt = require('jsonwebtoken');

const protectEndpoints = function (req, res, next) {

    let token = req.headers['authorization'];

    if (token){
        try{
            logindata = jwt.verify(token, badWolf.seceret);
            next();
        }catch(err){
            res.status(403).json({msg: "Not a valid token"});
        }
    }else{
        res.status(403).json({msg: "No token"});
    }

}

module.exports = protectEndpoints;