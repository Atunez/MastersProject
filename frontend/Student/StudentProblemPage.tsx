// Given if the current person is a student or teacher
// Generate the correct list of class cards for the main screen
import { useCookies } from "react-cookie";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";

interface TestCases {
    input: String,
    output: String,
    score: Number    
}
function GetProblemPage(){
    const location = useLocation();
    const navigate = useNavigate();
    const [exampleTestCases, setExampleTestCases] = useState<TestCases[]>([]);

    useEffect(() => {
        if(location.state.key === null){
            navigate(-1);
        }
    },[])

    useEffect(() => {axios.put('http://localhost:9000/testCases/getExampleCases', {
        pid: location.state.pid
    }).then(res => setExampleTestCases(res["data"]["exampleTests"]))}, [])

    const readTestFileData = file => {
        return new Promise((resolve, reject) => {
            const fr = new FileReader()
            fr.onerror = reject
            fr.onload = function () {
                resolve(fr.result)
            }
            fr.readAsText(file)
        })
    }


    const handleDrop = (acceptedFiles: any) => {
        const realFile = acceptedFiles.filter(x => x.name === "Main.java")[0]
        readTestFileData(realFile).then(res => axios.post("http://localhost:9000/submissions/submitSolution", {
            inputProgram: res,
            pid: location.state.pid
        }).then(res => console.log(res)))
    }

    return (
        <div>
            {exampleTestCases.map(test => {
                return (
                <div> 
                    {test.input}
                    <br />
                    {test.output}
                    <br />
                    {test.score}
                </div>)
            })}
            <br />
            Put in a Main.java File:
            <br />
            <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                </div>
            )}
            </Dropzone>
        </div>
    )
}

export default GetProblemPage;