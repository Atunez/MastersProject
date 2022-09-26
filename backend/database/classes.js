var express = require('express');
var router = express.Router();
var axios = require('axios');
const classesSchema = require("./classesSchema");

function generateClassKey(length){
    // Generates a new key....
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

// deal with adding a new class...
router.post('/addClass', async (req, res) => {
    // Generate a new key
    const keyToUse = generateClassKey(7);
    // Then submit the class to the database
    const newClass = new classesSchema({
        className: req.body.inputProgram, 
        instructor: req.body.pid, 
        classKey: keyToUse});
    newClass.save((err) => {
        if(err){
            res.status(500).json({message: "Error adding new Class to DB..."});
        }else{
            res.status(201).json({message: "Added Class to DB...", classKey: keyToUse});
        }
    });
});

module.exports = router;
