var express = require('express');
var router = express.Router();
var axios = require('axios');
const usersSchema = require("./usersSchema");
const classesSchema = require("./classesSchema");

function checkClassPassword(){
    return false;
}

router.put('/addClassToUser', async (req, res) => {
    // Then submit the class to the database
    const user = await usersSchema.findOne({email: req.body.email});
    // Guard for user existance...
    if(user == null){
        const newUser = new usersSchema({
            email: req.body.email, 
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            classesTaking: [req.body.classKey]});
        newUser.save((err) => {
            if(err){
                res.status(500).json({message: "Error adding new User (& Class) to DB..."});
            }else{
                res.status(201).json({message: "Added User (& Class) to DB..."});
            }
        });
        return;
    }
    // Guard for adding duplicate classes
    if(Object.values(user.classesTaking).includes(req.body.classKey)){
        res.status(201).json({message: "User contains class..."});
        return;
    }
    // Guard for correct password
    if(checkClassPassword()){
        res.status(401).json({message: "Incorrect Password Given..."});
        return;
    }
    user.classesTaking[Object.keys(user.classesTaking).length] = req.body.classKey
    user.save();
    res.status(201).json({message: "Added class to user list"})
});

router.post('/getUserClasses', async (req, res) => {
    // You get the teacher's classes by quering the Classes
    // For users you can query the actual schema
    console.log(req.body);
    if(req.body.isTeacher){
        const classToGet = await classesSchema.find({instructor: req.body.instructor});
        res.status(201).json({message: "Found classes Sir", classesInfo: Object.values(classToGet), weird: "Ye"});
        return;
    }else{
        const student = await usersSchema.find({email: req.body.email});
        res.status(201).json({message: "Found classes Sir2", classesInfo: Object.values(student[0].classesTaking), weird: "Ye"});
        return;
    }
});


module.exports = router;
