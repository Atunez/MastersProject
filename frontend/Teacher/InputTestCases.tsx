import React, { useEffect, useState } from "react";
import "./../styles.css";
import Dropzone from "react-dropzone";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface readFiles {
    name: String,
    content: String
}

interface TestCases {
    inputContent: String,
    outputContent: String,
    error: String
}

// Currently, resubmitting files resets all settings set, fix this...
function InputTestCases(){
    const [fileNames, setFileNames] = useState([]);
    const [moreUseFiles, setMUF] = useState<readFiles[]>([]);
    const [testcases, setTestcases] = useState<TestCases[]>([]);
    const [grades, setGrades] = useState<number[]>([]);
    const [examples, setExamples] = useState<boolean[]>([]);
    const [problemName, setProblemName] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      if(location.state === null){
        navigate("/TeacherPage")
      }
    }, [])
    console.log(location.state)

    // Move Files from readFiles format to an actual TestCases format...
    const formatData = (files: readFiles[]) => {
      var output:TestCases[] = []

      for(var i = 0; i < files.length+1; i++){
        // Find both input and output files...
        const inputFile = files.find(file => {
          return (file.name).endsWith(".in" + i)
        })
        const outputFile = files.find(file => {
          return (file.name).endsWith(".out" + i)
        })

        // If either is missing...
        if(inputFile === undefined && outputFile !== undefined){
          output = output.concat([{inputContent: "", outputContent: outputFile.content, error: "Missing Input"}]);
        }else if(inputFile !== undefined && outputFile === undefined){
          output = output.concat([{inputContent: inputFile.content, outputContent: "", error: "Missing Output"}]);
        }else if(inputFile !== undefined && outputFile !== undefined){
          output = output.concat([{inputContent: inputFile.content, outputContent: outputFile.content, error: ""}]);
        }
      }

      console.log(output)
      return output;
    }

    // Chunk to read information from Drag n Drop Files...
    const readTestFileData = file => {
        return new Promise((resolve, reject) => {
            const fr = new FileReader()
            fr.onerror = reject
            fr.onload = function () {
                resolve({name: file.name, content: fr.result} as readFiles)
            }
            fr.readAsText(file)
        })
    }

    const handleDrop = (acceptedFiles: any) =>
      Promise.all(acceptedFiles.map(readTestFileData)).then(res => {
        const d = formatData(res);
        setGrades(d.map(ele => 1));
        setExamples(d.map(ele => false));
        setMUF(res);
        setTestcases(d);
      }).catch(err => { console.log(err) });
    
    const getProblemSet = () => {
      const output = {}
      for(var i = 0; i < testcases.length; i++){
        if(testcases[i].error !== ""){
          continue;
        }
        output["test" + i] = {input: testcases[i].inputContent, output: testcases[i].outputContent, example: examples[i], score: grades[i]}
      }
      return JSON.stringify(output)
    }

    const submitProblem = () => {
      if(problemName !== ""){
        console.log("Submitting Problem...")

        axios.post("http://localhost:9000/classes/addAssignment", {
            classKey: location.state.key.classKey,
            problem: problemName,
            startdate: "e",
            enddate: "e",
            problemSet: getProblemSet()
        })  
      }
      navigate(-1)
    }
    // JSX To return....
    return (
      <div className="App">
        <TextField 
          label="Problem Name"
          value={problemName}
          onChange={e => {setProblemName(e.target.value)}}
        />
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag'n'drop files, or click to select files</p>
            </div>
          )}
        </Dropzone>
        <div>
          <strong>Files and Contents:</strong>
          <ul>
            {moreUseFiles.map(moreUseFiless => (
              <li key={moreUseFiless.name as any}>{moreUseFiless.name} {moreUseFiless.content}</li>
            ))}
          </ul>
          {testcases.map((files, index) => {
            return (<Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={"Test " + (index+1)}
                    >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}> {"Test " + (index+1)} </Typography>
                    <Typography > {files.error} </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ p: 2, border: '1px dashed grey' }}>
                                <Typography>
                                    {files.inputContent}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ p: 2, border: '1px dashed grey' }}>
                                <Typography>
                                    {files.outputContent}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ p: 2}}>
                              <FormGroup>
                                <FormControlLabel control={<Switch checked={examples[index]} onChange={e => {const temp = [...examples]; temp[index] = e.target.checked; setExamples(temp);}} />} disabled={files.error != ""} label="Example Test Case" />
                              </FormGroup>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ p: 2}}>
                              <TextField
                                id="outlined-name"
                                type="number"
                                label="Score"
                                disabled={files.error != ""}
                                value={grades[index]}
                                onChange={e => {const temp = [...grades]; temp[index] = parseInt(e.target.value); setGrades(temp);}}
                              />
                            </Box>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>)
          })}
        </div>
        <br />
        <Button variant="contained" onClick={submitProblem}>
          Submit Problem
        </Button>
      </div>
    );
  }

export default InputTestCases;