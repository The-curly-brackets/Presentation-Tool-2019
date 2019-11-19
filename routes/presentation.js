const express = require('express');
const tokenProtect = require('../modules/token');
const router = express.Router();
const db_credentials = process.env.DATABASE_URL || "postgres://jksoyjotdnrhsk:33d18816c28a98b69b2eb4022834ab1a5a273468828feace7172dc1e038c57f8@ec2-46-137-188-105.eu-west-1.compute.amazonaws.com:5432/d30m6bu4nsdneh";
const db = require("../modules/db")(db_credentials);

// Retrieves the raw presentation from the database
// TODO: maybe check on the visibility of the presentation ? TBD
router.get("/:presentationID", async function (req, res, next) {
    db.getPresentationById(req.params.presentationID).then(presentation => {
        res.status(200).send(presentation);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

// Here we try to create a new presentation.
router.use(tokenProtect.checkToken);
router.post("/", async function (req, res, next) {
    // We should make a query on the db to create a new presentation.
    // Careful you should add a row in both tables user_isAuthor_presentation and presentation !
    let token = req.headers['authorization'];

    if(token) {
        let userID = tokenProtect.getUserIDFromToken(token);

        db.createPresentation(userID, req.body).then(presentationId => {
            res.status(200).send(presentationId);
        }).catch(err => res.status(500).send(err));
    }});

// Here we ask the server if we can edit the presentation.
router.use(tokenProtect.checkToken);
router.get("/edit/:presentationID", async function (req, res, next) {
    let token = req.headers['authorization'];

    if(token) {
        let userID = tokenProtect.getUserIDFromToken(token);

        db.checkUserIsAuthor(userID, req.params.presentationID).then(isAuthor => {
            if (isAuthor) {
                res.status(200).send("You are allowed to edit");
            } else {
                res.status(403).send("You are not author of this presentation")
            }
        }).catch(err => res.status(500).send(err))
    } else {
        res.status(403).send("No token")
    }
});

// Here we try to update an existing presentation
// TODO: Define what must be in the DB's table presentation
router.use(tokenProtect.checkToken);
router.put("/:presentationID", async function (req, res, next) {
    let token = req.headers['authorization'];

    if(token) {
        let userID = tokenProtect.getUserIDFromToken(token);
        let presentationID = req.params.presentationID;
        let presentation = req.body.presentation;

        db.checkUserIsAuthor(userID, presentationID).then(isAuthor => {
            if (isAuthor) {
                db.updateExistingPresentation(presentationID, presentation).then(succesfull => {
                    if(succesfull) {
                        res.status(200).send(`Updated ${presentationID} succesfully`);
                    } else {
                        res.status(500).send(`Could not update ${presentationID}`)
                    }
                })
            } else {
                res.status(403).send("You are not author of this presentation")
            }
        }).catch(err => res.status(500).send(err))
    } else {
        res.status(403).send("No token")
    }
});

// Here we try to delete an existing presentation
router.use(tokenProtect.checkToken);
router.delete("/:presentationID", async function (req, res, next) {
    let token = req.headers['authorization'];

    if(token) {
        let userID = tokenProtect.getUserIDFromToken(token);
        let presentationID = req.params.presentationID;

        db.checkUserIsAuthor(userID, presentationID).then(isAuthor => {
            if (isAuthor) {
                db.deleteExistingPresentation(presentationID).then(succesfull => {
                    if(succesfull) {
                        res.status(200).send(`Deleted ${presentationID} succesfully`);
                    } else {
                        res.status(500).send(`Could not delete ${presentationID}`)
                    }
                })
            } else {
                res.status(403).send("You are not author of this presentation")
            }
        }).catch(err => res.status(500).send(err))
    } else {
        res.status(403).send("No token")
    }
});

module.exports = router;
