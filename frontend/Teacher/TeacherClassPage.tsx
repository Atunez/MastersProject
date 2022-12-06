import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../ElementWrapper";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


async function getUpdatedClass(classKey){
    console.log("Called updated class")
  }
  

function TeacherClassPage(e){
    const location = useLocation();
    const navigate = useNavigate();

    const [recentClassObj, setClassObj] = useState(location.state.key);
    useEffect(() => {
    axios.put("http://localhost:9000/classes/findClass", {
        classKey: location.state.key.classKey
    }).then(e => {setClassObj(e["data"]["classInfo"][0])}).catch(e => {console.log(e)})}, [])

    const getPlagrismReport = (content, pid) => {
        axios.post('http://localhost:9000/moss/generateReport', {
            pid: pid,
            content: content 
        }).then(output => {window.open(output["data"]["url"].replace("/\s+/g", ""), "_blank")!.focus()})
    }
    console.log(recentClassObj)

    const output = <div> 
        <Grid container spacing={8} justifyContent="center">
            <Grid item>
                <Button variant="contained" onClick={e => {navigate("/createProblem", { state: {key: recentClassObj}})}}>
                    Create Problem
                </Button>
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={e => {navigate("/GrandsPrix", { state: {key: recentClassObj}})}}>
                    Update Grands Prix
                </Button>
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={e => {navigate("/showGrandsPrix", { state: {key: recentClassObj}})}}>
                    Show Grands Prix
                </Button>
            </Grid>
        </Grid>
        <br />
        Hello 
        <br />
        {<div>
            <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Members of Class
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Number of Students: {recentClassObj.members.length}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <List>
            {recentClassObj.members.map(e => {
                return (<><ListItem>
                    <ListItemText primary={e} />
                </ListItem>
                <Divider /></>)
            })}
            </List>
            
          </Typography>
        </AccordionDetails>
            </Accordion>
             </div>}
        <br />
        {<div>
            {recentClassObj.assignments.map((a, i, arr) => {return (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Assignment {a.aid.split("_")[1]}
                    </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography> 
                        {a.grades.map(e => {return <>
                        <ListItem sx={{display:'flex', justifyContent:'flex-end'}}>
                            <ListItemText primary={e.name} secondary={<a href={window.URL.createObjectURL(new Blob([e.code], {type: 'text/plain'}))} download={e.name + "_" + a.aid + ".txt"}> Download Submission </a>} />
                            Score: {e.grade}
                        </ListItem>
                        <Divider />
                        </>})}
                        <br />
                        <a onClick={() => getPlagrismReport(a.grades, a.aid)}> Check Plagrism Report </a>
                    </Typography>
                    </AccordionDetails>
                </Accordion>)
            })}
        </div>}
    </div>;
    return TopBar("Class Page, Class: " + location.state.key.className, output); 
}

export default TeacherClassPage;

