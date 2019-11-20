const db_credentials = process.env.DATABASE_URL || "postgres://jksoyjotdnrhsk:33d18816c28a98b69b2eb4022834ab1a5a273468828feace7172dc1e038c57f8@ec2-46-137-188-105.eu-west-1.compute.amazonaws.com:5432/d30m6bu4nsdneh";
const db = require("./db")(db_credentials);

const authenticate = function (req, res, next) {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({message: 'Missing Authorization Header'});
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString();
    let [username, password] = credentials.split(':');
    try {
        db.getUserByNameAndPassword(username, password).then(user => {
            console.log(user);
            if (!user.valid) {
                return res.status(401).json({message: 'Invalid Authentication Credentials'});
            }
            req.userID = user.id;

            next();
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = authenticate;