var express = require('express');
var router = express.Router();
const testCasesScheme = require("./testCasesSchema");

// Add a test case given the input, output and pid...
router.post('/addTestCase', async (req, res) => {
  const currentProblemTestCases = await testCasesScheme.find({pid: req.body.pid});
  // Make sure the test is new for this problem
  for(const cases of currentProblemTestCases){
    if(cases.input == req.body.input){
      res.status(420).json({message: "Test case already exists..."});
      return;
    }
  }
  // Then add the actual test case
  const newTestCase = new testCasesScheme({input: req.body.input, output: req.body.output, pid: req.body.pid, score: req.body.score, example: req.body.example})
  newTestCase.save((err) => {
    if(err){
      res.status(500).json({message: "Error adding new test case...", error: err, inp: req.body});
    }else{
      res.status(201).json({message: "Added test case..."});
    }
  });
});

// get all test cases that are examples...
router.put('/getExampleCases', async (req, res) => {
  const allTestCases = await testCasesScheme.find({pid: req.body.pid})
  const output = []
  for(const tcase of allTestCases){
    if(tcase.example){
      output[output.length] = tcase
    }
  }
  res.status(201).json({message: "Got All Test Cases", exampleTests: output})
})

// function dealWithStuff(){
//     // Connect to the DB

//     //Set up some connections...
//     const db = mongoose.connection;
//     db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//     const testCasesScheme = require("./backend/database");
//     const impScheme = new testCasesScheme({input: "Hello", output: "Hello", pid: "1"});
//     impScheme.save((err) => {
//         if(err) console.log("Error in storing...");
//     })
// }

module.exports = router;
