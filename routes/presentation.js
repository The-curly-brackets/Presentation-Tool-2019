const express = require('express');
const tokenProtect = require('../modules/token');
const router = express.Router();
const db_credentials = process.env.DATABASE_URL || "postgres://jksoyjotdnrhsk:33d18816c28a98b69b2eb4022834ab1a5a273468828feace7172dc1e038c57f8@ec2-46-137-188-105.eu-west-1.compute.amazonaws.com:5432/d30m6bu4nsdneh";
const db = require("../modules/db")(db_credentials);

function getUserIDFromToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer(base64, 'base64');
    const payloadinit = buff.toString('ascii');
    const payload = JSON.parse(payloadinit);
    console.log(payload);

    return payload.userID;
}

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
router.use(tokenProtect);
router.post("/", async function (req, res, next) {
    // We should make a query on the db to create a new presentation.
    // Careful you should add a row in both tables user_isAuthor_presentation and presentation !
    let token = req.headers['authorization'];

    if(token) {
        let userID = getUserIDFromToken(token);

        db.createPresentation(userID).then(presentationID => {
            res.status(200).send(`Successfully created empty presentation ${presentationID}`)
        }).catch(err => res.status(500).send(err));
    }});

// Here we ask the server if we can edit the presentation.
router.use(tokenProtect);
router.get("/edit/:presentationID", async function (req, res, next) {
    // Get the token, get the userID and verify that the userID and presentationID
    // are featured in the same row in user_isAuthor_presentation if it is present,
    // then return 200, if not return 403 Forbidden.
    let token = req.headers['authorization'];

    if(token) {
        let userID = getUserIDFromToken(token);

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
router.use(tokenProtect);
router.put("/:presentationID", async function (req, res, next) {
    // We've got the presentation in the body, check if the person uploading is the author,
    // if so: make a query on the database to update it and return 200.
    // if not: return 403 Forbidden.
    // if the db bugs: return 500.

    let token = req.headers['authorization'];

    if(token) {
        let userID = getUserIDFromToken(token);
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
router.use(tokenProtect);
router.delete("/:presentationID", async function (req, res, next) {
    // Kinda similar to update. Check if the person making the request is the author,
    // if so: make a query on the database to delete it and return 200
    // if not: return 403 Forbidden.
    // if the db bugs: return 500.
    let token = req.headers['authorization'];

    if(token) {
        let userID = getUserIDFromToken(token);
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
