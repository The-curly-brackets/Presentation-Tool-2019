const crypto = require('crypto');

const hash = function(password, salt){
    let hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

const saltHashPassword = function (userPassword) {
    let salt = crypto.randomBytes(16).toString('base64');
    return hash(userPassword, salt);
};

module.exports= {
    hash:hash,
    saltHashPassword:saltHashPassword
};