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
    }, 
    {timestamps: true});

module.exports = new mongoose.model("classes", classesSchema);