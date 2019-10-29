var express = require('express');
var router = express.Router();

const db_credentials = process.env.DATABASE_URL || "postgres://jksoyjotdnrhsk:33d18816c28a98b69b2eb4022834ab1a5a273468828feace7172dc1e038c57f8@ec2-46-137-188-105.eu-west-1.compute.amazonaws.com:5432/d30m6bu4nsdneh";
const db = require("../modules/db") (db_credentials);

// Get the users details for now returns the whole object stored in the database
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
router.put("/:userID", async  function(req, res, next) {

});

// Deletes an existing user
router.delete("/:userID", async  function(req, res, next) {

});

// Recieves a user object and creates an account in the db from it
router.post("/", async  function(req, res, next) {

});

module.exports = router;