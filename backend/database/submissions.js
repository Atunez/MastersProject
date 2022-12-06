var express = require('express');
var router = express.Router();
var axios = require('axios');
const testCasesScheme = require("./testCasesSchema");
const submissionsScheme = require("./submissionsSchema");
const classesSchema = require('./classesSchema');

// temp cuz im lazy for now...
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// deal with submittion of a problem...
router.post('/submitSolution', async (req, res) => {
    // When you submit a solution find all the problems to run the solution against...
    const testCases = await testCasesScheme.find({pid: req.body.pid});
    // Place to keep track of results...
    const submissionRecord = [];
    const totalGrade = [];
    // for each test case
    var failedLastTest = false; 
    for(const test of testCases){
        // If you failed the last test then RIP...
        if(failedLastTest) break;
        console.log(test);
        // But otherwise, just go through all the tests like normal
        console.log(test.input)
        console.log(test.output)
        const submissionData = JSON.stringify({
            "source_code": req.body.inputProgram,
            "language_id": 62, // Hard-coded to be java...
            "stdin": test.input,
            "expected_output": test.output
        });
        const submissionConfig = {
            method: 'post',
            url: 'http://localhost:2358/submissions/?base64_encoded=false&wait=false',
            headers: { 
                'Content-Type': 'application/json'
              },
            data: submissionData
        } 
        await axios(submissionConfig).then(async resp => {
            console.log("Initial Submittion")
            console.log(resp.data)
            const submissionToken = resp.data.token;
            const resultsConfig = {
                method: 'get',
                url: 'http://localhost:2358/submissions/' + submissionToken,
                headers: {}
            }
            // Remove this to a different class...
            await sleep(3000);
            await axios(resultsConfig).then(resps => {
                // If you failed the test then no need to continue...
                submissionRecord.push(JSON.stringify(resps.data));
                if(resps.data.status.description != "Accepted"){
                    console.log("Failed Test...")
                    failedLastTest = true;
                }else{
                    totalGrade.push(test.score);
                }
                console.log(resps.data);
            }).catch(err => {
                res.status(500).json({message: err})
                return;
            })
        }).catch(err => {
            res.status(500).json({message: err})
            return;
        });
    }
    // After you are done with all the tests, put the results in the DB, and return it to the user...
    const newSubmission = new submissionsScheme({
        inputProgram: req.body.inputProgram, 
        pid: req.body.pid, 
        result: totalGrade, 
        judgeResult: submissionRecord});
    newSubmission.save((err) => {
        if(err){
            res.status(500).json({message: "Error adding new submission to DB..."});
        }
    });
    axios.post('http://localhost:9000/classes/updateGrade', {
        classKey: req.body.classKey,
        name: req.body.name,
        score: totalGrade.reduce((p, c) => p + c, 0),
        pid: req.body.pid,
        time: req.body.time,
        code: req.body.inputProgram
    }).then(e => res.status(201).json({message: "Updated everything correctly"})).catch(e => res.status(404).json({message: "Updated everything NOT correctly"}))

});

module.exports = router;
