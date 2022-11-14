var express = require('express');
var router = express.Router();
var axios = require('axios');
const classesSchema = require("./classesSchema");
const newClassesKeySize = 8;

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
    const keyToUse = generateClassKey(newClassesKeySize);
    // Then submit the class to the database
    const newClass = new classesSchema({
        className: req.body.className, 
        instructor: req.body.instructor, 
        classKey: keyToUse,
        classPassword: req.body.password});
    newClass.save((err) => {
        if(err){
            res.status(500).json({message: "Error adding new Class to DB..."});
        }else{
            res.status(201).json({message: "Added Class to DB...", classKey: keyToUse});
        }
    });
});

// Add some student to a class
router.put('/addStudentToClass', async (req, res) => {
    const classToGet = await classesSchema.findOne({classKey: req.body.classKey});
    if(req.body.classPassword != classToGet.classPassword){
        res.status(401).json({message: "Incorrect Class Password"})
    }else{
        classToGet.members[Object.keys(classToGet.members).length] = req.body.studentObj
        await classToGet.save();
        res.status(201).json({message: "Added student to class"});
    }
});

// Given a class key, return the class..
router.put('/findClass', async (req, res) => {
    const classToGet = await classesSchema.find({classKey: req.body.classKey});
    res.status(201).json({message: "Found class", classInfo: classToGet})
});

router.post('/addAssignment', async (req, res) => {
    let classToGet = await classesSchema.find({classKey: req.body.classKey});
    classToGet = classToGet[0]
    const leng = Object.keys(classToGet.assignments).length
    const apid = req.body.classKey + "_" + req.body.problem + "_" + leng
    classToGet.assignments[leng] = (apid, req.body.startdate, req.body.enddate, []);
    let problemSet = req.body.problemSet;
    problemSet = JSON.parse(problemSet);
    for(obj of Object.keys(problemSet)){
        await axios.post("http://localhost:9000/testcases/addTestCase", {
            input: problemSet[obj].input,
            output: problemSet[obj].output,
            pid: apid,
            score: problemSet[obj].score,
            example: problemSet[obj].example
        })
    }
    await classToGet.save();
    res.status(201).json({message: "Added Assignment"})
})

router.post('/updatePrix', async (req, res) => {
    // Prix Updates would need the list of assingments, and start and end...
    let classToGet = await classesSchema.find({classKey: req.body.classKey});
    classToGet = classToGet[0];
    const leng = Object.keys(classToGet.prix).length;
    classToGet.prix[leng] = (req.body.assignmentList, req.body.startdate, req.body.enddate);
    classToGet.save();
    res.status(201).json({message: "Updated Prix"});
})

module.exports = router;
