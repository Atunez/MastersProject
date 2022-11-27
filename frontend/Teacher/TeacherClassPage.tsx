import { Button, Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../ElementWrapper";


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
        Show All Participants
        <br />
        Show Assignments
    </div>;
    return TopBar("Class Page, Class: " + location.state.key.className, output); 
}

export default TeacherClassPage;

