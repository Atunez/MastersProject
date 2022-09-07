var express = require('express');
var router = express.Router();
var axios = require('axios');
const testCasesScheme = require("./testCasesSchema");
const submissionsScheme = require("./submissionsSchema");

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
        // But otherwise, just go through all the tests like normal
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
            await sleep(5000);
            await axios(resultsConfig).then(resps => {
                // If you failed the test then no need to continue...
                submissionRecord.push(JSON.stringify(resps.data));
                totalGrade.push(test.score);
                if(resps.data.status.description != "Accepted"){
                    failedLastTest = true;
                }
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
        }else{
            res.status(201).json({message: "Added submission to DB...", results: totalGrade, judgeResults: submissionRecord});
        }
    });
});

module.exports = router;
