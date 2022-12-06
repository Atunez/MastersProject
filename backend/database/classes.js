var express = require('express');
var router = express.Router();
var axios = require('axios');
const classesSchema = require("./classesSchema");
const ObjectID = require('mongodb').ObjectId;
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
    if(classToGet == null || classToGet.classPassword == null){
        res.status(401).json({message: "Incorrect Class Password"})
        return;
    }
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
    var leng = 0;
    if(classToGet.assignments != undefined){
        leng = Object.keys(classToGet.assignments).length;
    }
    const apid = req.body.classKey + "_" + req.body.problem + "_" + leng
    classToGet.assignments[leng] = {aid: apid, startTime: req.body.startdate, endTime: req.body.enddate, grades: []};
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
    var leng = 0;
    if(classToGet.prix != undefined){
        leng = Object.keys(classToGet.prix).length;
    }
    classToGet.prix[leng] = {problemList: req.body.assignmentList, startTime: req.body.startdate, endTime: req.body.enddate, gradeInfo: req.body.gradeInfo};
    classToGet.save();
    res.status(201).json({message: "Updated Prix"});
})

router.post('/getAssignmentById', async (req, res) => {
    let classToGet = await classesSchema.find({classKey: req.body.classKey});
    classToGet = classToGet[0];
    const assignment = classToGet.assignments.filter(e => {return e._id.equals(ObjectID(req.body.pid))})
    if(assignment.length == 0){
        res.status(404).json({message: "Can't find Problem"});
    }else{
        res.status(201).json({message: "Got Problem", assignment: assignment});
    }
})

router.post('/updateGrade', async (req, res) => {
    let classToGet = await classesSchema.find({classKey: req.body.classKey});
    classToGet = classToGet[0];
    let assignment = classToGet.assignments.filter(e => {return e.aid == req.body.pid})
    assignment = assignment[0]
    const studentrecord = assignment.grades.filter(e => {return e.name == req.body.name})
    if(studentrecord == null || studentrecord.length == 0){
        assignment.grades[assignment.grades.length] = {name: req.body.name, grade: req.body.score, time: req.body.time, code: req.body.code}
        classToGet.save();
        res.status(201).json({message: "Added Student to DB"});
        return;
    }
    if(req.body.score > studentrecord[0].grade){
        studentrecord[0].grade = req.body.score
        studentrecord[0].time = req.body.time
        studentrecord[0].code = req.body.code
        classToGet.save();
        res.status(201).json({message: "Updated Student Grade"});
        return;
    }
    res.status(201).json({message: "Student got worse grade"});
})

module.exports = router;
