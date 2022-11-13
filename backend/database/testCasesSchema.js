const mongoose = require('mongoose');
const testCasesScheme = new mongoose.Schema(
    {
        input: {
            required: true,
            type: String
        },
        output: {
            required: true,
            type: String
        },
        pid: {
            required: true,
            type: String
        },
        score: {
            required: true,
            type: Number
        },
        example: {
            required: false,
            type: Boolean
        }
    }, 
    {timestamps: true});

module.exports = new mongoose.model("testCases", testCasesScheme);