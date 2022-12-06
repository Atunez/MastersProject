var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');
const exec = require("child_process").exec;
const path = require("path");
const { default: axios } = require('axios');
const fs = require("fs");

var moss;
const mossid = 250133102

router.post('/generateReport', async (req, res) => {
    const allUserInputs = req.body.content

    // for(const user of allUserInputs){
    //     const filename = user.name + ".java"
    // }
    Promise.all(allUserInputs.map(e => {fs.writeFile("./submissions/" + e.name + ".java", e.code, e => {console.log("Wrote Smth" + e)})}))
    .then(e => {console.log("Added all files")
    exec("python ./moss/mossclient.py 2 " + mossid, async (err, out) => {
        console.log(out.toString("utf8"))
        fs.readdir("./submissions/", (err, files) => {
            Promise.all(files.map(e => {fs.unlink(path.join("./submissions/", e), () => {})})).then(e => {
                res.status(201).json({message: "Got report", url: out.toString("utf8")});
            })
        })
    })
    // const reportURL = spawn('python', ['./moss/mossclient.py', 2, mossid])
    // reportURL.on('data', e => {
    //     console.log(e.toString())
    //     //res.status(201).json({message: "Got report", url: e.toString()});
    // })
    // reportURL.on('exit', e => {
    //     fs.rmdir("./submissions", {recursive: true}, () => console.log("Removed Directory"))
    // })
    })
    .catch(e => console.log("Smth went wrong" + e))
})

module.exports = router;