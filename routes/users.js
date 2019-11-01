const express = require('express');
const authProtect = require('../modules/auth');
const tokenProtect = require('../modules/token');
const router = express.Router();

let secretSash;
try {
    secretSash = require("../modules/badWolf");
} catch(err) {
    //not local.
}

const secret = process.env.secret || secretSash.secret;
const db_credentials = process.env.DATABASE_URL || "postgres://jksoyjotdnrhsk:33d18816c28a98b69b2eb4022834ab1a5a273468828feace7172dc1e038c57f8@ec2-46-137-188-105.eu-west-1.compute.amazonaws.com:5432/d30m6bu4nsdneh";
const db = require("../modules/db")(db_credentials);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const badWolf = require('../modules/badWolf');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Get the users details for now returns the whole object stored in the database
router.get("/:userID", tokenProtect); // This endPoint is 'login' protected
router.get("/:userID", async function (req, res, next) {
    db.getUserByID(req.params.userID).then(user => {
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(404).send("userID non-existing");
        }
    }).catch(err => res.status(500).send(err));
});

// Updates an existing user
router.put("/:userID", async function (req, res, next) {

});

// Deletes an existing user
router.delete("/:userID", async function (req, res, next) {

});

// Receives a user object and creates an account in the db from it
router.post("/", async function (req, res, next) {
    let pswhash = bcrypt.hashSync(req.body.password, 10);
    db.makeUserAccount(req.body.username, req.body.email, pswhash).then(newAccount => {
        if(newAccount){
            let payload = {userid: newAccount.id};
            let tok = jwt.sign(payload, secret, {expiresIn: "12h"});
            res.status(200).send({token:tok});
        }else {
            res.status(404).send("Not able to create account");
        }
    }).catch(err => res.status(500).send(err));
});

router.post("/login", authProtect);
route.post("/login", async function (req, res, next) {
    let tok = jwt.sign({userID: req.userID}, secret, {expiresIn: "12h"});
    res.status(200).json({userID: req.userID, token: tok});
});

module.exports = router;
