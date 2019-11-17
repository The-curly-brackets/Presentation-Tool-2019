const express = require('express');
const router = express.Router();

const db_credentials = process.env.DATABASE_URL || "postgres://jksoyjotdnrhsk:33d18816c28a98b69b2eb4022834ab1a5a273468828feace7172dc1e038c57f8@ec2-46-137-188-105.eu-west-1.compute.amazonaws.com:5432/d30m6bu4nsdneh";
const db = require("../modules/db") (db_credentials);

const badWolf = require('../modules/badWolf');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// User login
router.post("/login", async function(req, res, next){
    db.getUserByUsername(req.body.username).then(user => {
        if(user) {
            let check = bcrypt.compareSync(req.body.password, user.password);
            
            if(check){ 
                let payload = {userid: user.id};
                let tok = jwt.sign(payload, badWolf.seceret, {expiresIn: "12h"});
                res.status(200).json({token: tok});
            }else{
                res.status(400).json({msg: "Wrong password"});
            }
        }else {
            res.status(400).json({msg: "User doesn't exsist"});
        }
    })
})


// Get the users details for now returns the whole object stored in the database
router.get("/:userID", async function (req, res, next) {
    let userID = req.params.userID.split(":");
    db.getUserByID(userID[1]).then(user => {
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(404).send("userID non-existing");
        }
    }).catch(err => res.status(500).send(err));
});

// Updates an existing users username, email or password
router.put("/:userID", async function(req, res, next) {
    let token = req.headers['authorization'];

    if (token){
        try{
            logindata = jwt.verify(token, badWolf.seceret);
            let userID = logindata.userid;

            if(req.body.username){
                db.getUserByUsername(req.body.username).then(userExist => {

                    if(!userExist){
                        db.updateUsername(userID, req.body.username).then(user =>{
                            if(user) {
                                res.status(200).send(user);
                            }
                        }).catch(err => res.status(500).send(err));
                    }
                    
                    if(userExist.id !== req.body.userid){
                        res.status(404).json({msg: "Username is alredy taken"});
                    }else{
                        console.log("your username");
                    }
                      
                });
            }
            
            if(req.body.email){
                db.updateUserEmail(userID, req.body.email).then(user =>{
                    if(user) {
                        res.status(200).send(user);
                    }else{
                        res.status(404).json({msg: "user dosn't exsist"})
                    }
                }).catch(err => res.status(500).send(err));
            }

            if(req.body.password){
                let pswhash = bcrypt.hashSync(req.body.password, 10);
                db.updateUserPassword(userID, pswhash).then(user =>{
                    if(user) {
                        res.status(200).send(user);
                    }else{
                        res.status(404).json({msg: "user dosn't exsist"})
                    }
                }).catch(err => res.status(500).send(err));
            }
            
        }catch(err){
            res.status(403).json({msg: "Not a valid token"});
        }
    }else{
        res.status(403).json({msg: "No token"});
    }
});

// Deletes an existing user
router.delete("/:userID", async  function(req, res, next) {
    let token = req.headers['authorization'];
    if (token){
        try {
            logindata = jwt.verify(token, badWolf.seceret);
            let userID = logindata.userid;

            db.deleteUserAccount(userID).then(user => {
                res.status(200).json({msg: "Account is deleted"})
            }).catch(err => res.status(500).send(err));
        }
        catch (err){
            console.log(err);
        }
    }
});

// Recieves a user object and creates an account in the db from it
router.post("/newAccount", async  function(req, res, next) {
    db.getUserByUsername(req.body.username).then(user => {
        if(!user){
            let pswhash = bcrypt.hashSync(req.body.password, 10);
            db.makeUserAccount(req.body.username, req.body.email, pswhash).then(newAccount => {
            if(newAccount){
                let payload = {userid: newAccount.id};
                let tok = jwt.sign(payload, badWolf.seceret, {expiresIn: "12h"});
                res.status(200).send({token:tok});
            }else {
                res.status(404).send("Not able to create account");
            }
        }).catch(err => res.status(500).send(err));
        }
    });
});

module.exports = router;
