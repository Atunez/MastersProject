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
        assignments: {
            required: false,
            type: [String]
        }, 
        // List of Prixs IDs...
        prix: {
            required: false,
            type: [String]
        }
    }, 
    {timestamps: true});

module.exports = new mongoose.model("classes", classesSchema);