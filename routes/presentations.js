const express = require('express');
const router = express.Router();

const db_credentials = process.env.DATABASE_URL || "postgres://jksoyjotdnrhsk:33d18816c28a98b69b2eb4022834ab1a5a273468828feace7172dc1e038c57f8@ec2-46-137-188-105.eu-west-1.compute.amazonaws.com:5432/d30m6bu4nsdneh";
const db = require("../modules/db") (db_credentials);

router.post("/newPresentation", async function(req, res, next){
    db.makeNewPresentation(req.body, "0").then(pres => {
        res.status(200).json({presentation: pres});
    })
    
});

router.get("/:presID", async function(req, res, next){
    db.getPresentationById(req.params.presID).then(presentation => {
        
        if(presentation){
            res.status(200).json({pres: presentation});
        }else{
            res.status(400).json({msg: "error"})
        }
    }).catch(err => res.status(500).send(err));
})

router.post("/getPresentationByID", async function(req, res, nex){
    db.getPresentationById("10").then(presentation => {
        
        if(presentation){
            res.status(200).json({pres: presentation});
        }else{
            res.status(400).json({msg: "error"})
        }
    }).catch(err => res.status(500).send(err));
});

router.post("/updatePresentation", async function(req, res, next){
    db.updatePresentation(req.body.presID, req.body.pres).then(presentation =>{
        if(presentation){
            res.status(200).json({msg: "presentation is saved"});
        }else{
            res.status(400).json({msg: "error"})
        }
    }).catch(err => res.status(500).send(err));
})

module.exports = router;
