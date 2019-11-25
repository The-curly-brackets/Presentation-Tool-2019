const express = require('express');
const tokenProtect = require('../modules/token');
const router = express.Router();
const db_credentials = process.env.DATABASE_URL;
const db = require("../modules/db")(db_credentials);


router.get("/overview",tokenProtect.checkToken, async function (req, res, next) {
    let token = req.headers['authorization'];

    if (token) {
        let userID = tokenProtect.getUserIDFromToken(token);

        db.getAllPresentationFromUser(userID).then(presentations => {
            res.status(200).send(presentations);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }
});

router.get("/:presentationID", async function (req, res, next) {
    db.getPresentationById(req.params.presentationID).then(presentation => {
        console.log(presentation);
        if (presentation.visibility === 2) {
            res.status(200).send(presentation);
        } else {
            let token = req.headers['authorization'];
            let userID = tokenProtect.getUserIDFromToken(token);
            db.checkUserIsAuthor(userID, req.params.presentationID).then(isAuthor => {
                if (isAuthor) {
                    res.status(200).send(presentation);
                } else {
                    res.status(403)
                }
            }).catch((err) => {
                res.status(500).send(err);
            });
        }
    })
});

router.post("/", tokenProtect.checkToken, async function (req, res, next) {
    let token = req.headers['authorization'];

    if (token) {
        let userID = tokenProtect.getUserIDFromToken(token);

        db.createPresentation(userID, req.body).then(presentationId => {
            
            res.status(200).send(presentationId);
        }).catch(err => res.status(500).send(err));
    }
});

router.get("/edit/:presentationID",tokenProtect.checkToken, async function (req, res, next) {
    let token = req.headers['authorization'];

    if (token) {
        let userID = tokenProtect.getUserIDFromToken(token);

        db.checkUserIsAuthor(userID, req.params.presentationID).then(isAuthor => {
            if (isAuthor) {
                res.status(200).send({msg: "You are allowed to edit"});
            } else {
                res.status(403).send({msg: "You are not author of this presentation"});
            }
        }).catch(err => res.status(500).send(err));
    } else {
        res.status(403).send({msg: "No token"});
    }
});

router.put("/visibility/:presentationID",tokenProtect.checkToken, async function (req, res, next) {
    let token = req.headers['authorization'];

    if (token) {
        let userID = tokenProtect.getUserIDFromToken(token);
        let presentationID = parseInt(req.params.presentationID);
        let visibility =  parseInt(req.body.visibility);


        db.checkUserIsAuthor(userID,presentationID).then(isAuthor => {
            if (isAuthor) {
                db.updateExistingPresentationVisibility(visibility, presentationID).then(succesfull => {
                    if (succesfull) {
                        res.status(200).send({msg: `Updated ${presentationID} succesfully`});
                    } else {
                        res.status(500).send({msg: `Could not update ${presentationID}`});
                    }
                })
            } else {
                res.status(403).send({msg: "You are not author of this presentation"});
            }
        }).catch(err => res.status(500).send(err));
    } else {
        res.status(403).send({msg: "No token"})
    }
});

router.put("/:presentationID", tokenProtect.checkToken, async function (req, res, next) {
    let token = req.headers['authorization'];

    if (token) {
        let userID = tokenProtect.getUserIDFromToken(token);
        let presentationID = parseInt(req.params.presentationID);
        let presentation = req.body;


        db.checkUserIsAuthor(userID, presentationID).then(isAuthor => {
            if (isAuthor) {
                db.updateExistingPresentation(presentation, presentationID).then(succesfull => {
                    if (succesfull) {
                        res.status(200).send({msg: `Updated ${presentationID} succesfully`});
                    } else {
                        res.status(500).send({msg: `Could not update ${presentationID}`});
                    }
                })
            } else {
                res.status(403).send({msg: "You are not author of this presentation"});
            }
        }).catch(err => res.status(500).send(err));
    } else {
        res.status(403).send({msg: "No token"})
    }
});

router.delete("/:presentationID", tokenProtect.checkToken, async function (req, res, next) {
    let token = req.headers['authorization'];

    if (token) {
        let userID = tokenProtect.getUserIDFromToken(token);
        let presentationID = req.params.presentationID;

        db.checkUserIsAuthor(userID, presentationID).then(isAuthor => {
            if (isAuthor) {
                db.deleteExistingPresentation(presentationID).then(succesfull => {
                    if (succesfull) {
                        res.status(200).send({msg: `Deleted ${presentationID} succesfully`});
                    } else {
                        res.status(500).send({msg: `Could not delete ${presentationID}`});
                    }
                })
            } else {
                res.status(403).send({msg: "You are not author of this presentation"});
            }
        }).catch(err => res.status(500).send(err));
    } else {
        res.status(403).send({msg: "No token"});
    }
});
module.exports = router;
