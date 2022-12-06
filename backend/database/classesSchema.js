const mongoose = require('mongoose');
// Each class is ...
const classesSchema = new mongoose.Schema(
    {
        // Name...
        className: {
            required: true,
            type: String
        },
        // Instructor...
        instructor: {
            required: true,
            type: String
        },
        // Key to Join...
        classKey: {
            required: true,
            type: String
        },
        // Password to join the actual class
        classPassword: {
            required: true,
            type: String
        },
        // List of Students
        members: {
            required: false,
            type: [String]
        },
        // List of Class Assignments
        // Assignments should hold the grade for each student too...
        assignments: {
            required: false,
            type: [{aid: String, endTime: String, startTime: String, grades: [{name: String, grade: Number, time: String, code: String}]}]
        }, 
        // Prixs are just a list of assignment IDs....
        prix: {
            required: false,
            type: [{problemList: [String], startTime: String, endTime: String, gradeInfo: String}]
        }
    }, 
    {timestamps: true});

module.exports = new mongoose.model("classes", classesSchema);