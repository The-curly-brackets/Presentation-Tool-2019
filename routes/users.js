const express = require('express');
const authProtect = require('../modules/auth');
const tokenProtect = require('../modules/token');
const router = express.Router();

let secretSash;
try {
    secretSash = require("../modules/badWolf");
} catch (err) {
    //not local.
}

const secret = process.env.secret || secretSash.secret;
const db_credentials = process.env.DATABASE_URL;
const db = require("../modules/db")(db_credentials);
const jwt = require('jsonwebtoken');
const hash = require("../modules/hash");

router.get("/", async function (req, res, next) {
    let token = req.headers['authorization'];

    if (token) {
        try {
            let userID = tokenProtect.getUserIDFromToken(token);

            db.getUserByID(userID).then(user => {
                if (user) {
                    res.status(200).send(user)
                } else {
                    res.status(404).send({msg: "userID non-existing"});
                }
            });
        } catch (err) {
            res.status(403).json({msg: "Not a valid token"});
        }
    } else {
        res.status(403).json({msg: "No token"});
    }
});

router.put("/", tokenProtect.checkToken, async function (req, res, next) {
    let token = req.headers['authorization'];

    if (token) {
        try {
            let userID = tokenProtect.getUserIDFromToken(token);

            if (req.body.username) {
                db.getUserByUsername(req.body.username).then(userExist => {

                    if (!userExist) {
                        db.updateUsername(userID, req.body.username).then(user => {
                            if (user) {
                                res.status(200).send(user);
                            }
                        }).catch(err => res.status(500).send(err));
                    }

                    if (userExist.id !== req.body.userid) {
                        res.status(404).json({msg: "Username is alredy taken"});
                    } else {
                        console.log("your username");
                    }

                });
            }

            if (req.body.email) {
                db.updateUserEmail(userID, req.body.email).then(user => {
                    if (user) {
                        res.status(200).send(user);
                    } else {
                        res.status(404).json({msg: "user dosn't exsist"})
                    }
                }).catch(err => res.status(500).send(err));
            }

            if (req.body.password) {
                let pswhash = hash.saltHashPassword(req.body.password);
                db.updateUserPassword(userID, pswhash).then(user => {
                    if (user) {
                        res.status(200).send(user);
                    } else {
                        res.status(404).json({msg: "user doesn't exsist"})
                    }
                }).catch(err => res.status(500).send(err));
            }

        } catch (err) {
            res.status(403).json({msg: "Not a valid token"});
        }
    } else {
        res.status(403).json({msg: "No token"});
    }
});

router.delete("/", tokenProtect.checkToken, async function (req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        try {
            let userID = tokenProtect.getUserIDFromToken(token);

            db.deleteUserAccount(userID).then(user => {
                res.status(200).json({msg: "Account is deleted"})
            }).catch(err => res.status(500).send(err));
        } catch (err) {
            console.log(err);
        }
    }
});

router.post("/login", authProtect, async function (req, res, next) {
    let tok = jwt.sign({userID: req.userID}, secret, {expiresIn: "12h"});
    res.status(200).json({userID: req.userID, token: tok});
});

router.post("/", async function (req, res, next) {
    let pswhash = JSON.stringify(hash.saltHashPassword(req.body.password));
    db.makeUserAccount(req.body.username, req.body.email, pswhash).then(newAccount => {
        if (newAccount) {
            let payload = {userid: newAccount.id};
            let tok = jwt.sign(payload, secret, {expiresIn: "12h"});
            res.status(200).send({token: tok});
        } else {
            res.status(404).send({msg: "Not able to create account"});
        }
    }).catch(err => res.status(500).send(err));
});

module.exports = router;