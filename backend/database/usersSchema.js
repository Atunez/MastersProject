const mongoose = require('mongoose');
// Each submission involves...
const usersSchema = new mongoose.Schema(
    {
        // The program itself...
        inputProgram: {
            required: true,
            type: String
        },
        // The problem this program is meant to solve...
        pid: {
            required: true,
            type: String
        },
        // The result of the program...
        result: {
            required: false,
            type: [Number]
        },
        // Dump whatever the judge says as the output here...
        // We will do lazy evaluation and stop the executation of tests on the first failed test...
        judgeResult: {
            required: false,
            type: [String]
        }
    }, 
    {timestamps: true});

module.exports = new mongoose.model("users", usersSchema);