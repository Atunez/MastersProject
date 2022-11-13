const mongoose = require('mongoose');
// Each submission involves...
const usersSchema = new mongoose.Schema(
    {
        // Email of the user, is unique...
        email: {
            required: true,
            type: String
        },
        // User's First Name...
        firstName: {
            required: true,
            type: String
        },
        // User's Last name...
        lastName: {
            required: true,
            type: String
        },
        // Classes they are in
        classesTaking: {
            required: true,
            type: [String]
        }
    }, 
    {timestamps: true});

module.exports = new mongoose.model("users", usersSchema);