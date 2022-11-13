const mongoose = require('mongoose');
// Each submission involves...
const prixScheme = new mongoose.Schema(
    {
        // ID of Prix...
        pid: {
            required: true,
            type: String
        },
        // Set Of Problems (ids)...
        problemSet: {
            required: true,
            type: [Number]
        },
        // Scores....
        scoreList: {
            required: true,
            type: [[String]]
        }, 
        // tuple of Start Time and Time between problems...
        timeSpace: {
            required: true,
            type: [String]
        }
    }, 
    {timestamps: true});

module.exports = new mongoose.model("prix", prixScheme);