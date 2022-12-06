// Given if the current person is a student or teacher
// Generate the correct list of class cards for the main screen
import { useCookies } from "react-cookie";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, CardContent, FormControlLabel, FormGroup, Grid, Switch, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import dayjs, { Dayjs } from 'dayjs';
import TopBar from "../ElementWrapper";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface TestCases {
    input: String,
    output: String,
    score: Number    
}
function GetProblemPage(){
    const location = useLocation();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies();

    const [exampleTestCases, setExampleTestCases] = useState<TestCases[]>([]);

    useEffect(() => {
        if(location.state.key === null){
            navigate(-1);
        }
    },[])

    console.log(location.state)

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
        if(realFile == undefined){
            console.log("Submitted Incorrect File(s)");
            return;
        }
        readTestFileData(realFile).then(res => axios.post("http://localhost:9000/submissions/submitSolution", {
            inputProgram: res,
            pid: location.state.pid,
            classKey: location.state.key,
            name: cookies.firstName + " " + cookies.lastName,
            time: dayjs().toString()
        }).then(res => console.log(res)))
    }

    const output = (
        <div>
            {exampleTestCases.map((test, idx) => {
                
                return (<Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id={"Test " + (idx+1)}
                            >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}> {"Example Test Case " + (idx+1)} </Typography>
                        </AccordionSummary>
                    <AccordionDetails>
                        <>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box sx={{ p: 2, border: '1px dashed grey' }}>
                                    <Typography>
                                       {test.input}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ p: 2, border: '1px dashed grey' }}>
                                    <Typography>
                                        {test.output}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <br/>
                        Points: {test.score}
                        </>
                    </AccordionDetails>
                </Accordion>)
            })}
            <br />
            <br />
            Put in a Main.java File:
            <br />
            <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>Drag'n'drop files, or click to select files</p>
                </div>
            )}
            </Dropzone>
        </div>
    )
    return TopBar("Problem Page, Problem: " + location.state.pid, output);
}

export default GetProblemPage;