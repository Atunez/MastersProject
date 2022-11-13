import { Button, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../ElementWrapper";


function TeacherClassPage(e){
    const location = useLocation();
    const navigate = useNavigate();

    const output = <div> 
        <Grid container spacing={8} justifyContent="center">
            <Grid item>
                <Button variant="contained" onClick={e => {navigate("/createProblem", { state: {key: location.state.key}})}}>
                    Create Problem
                </Button>
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={e => {navigate("/createGrandsPrix", { state: {key: location.state.key}})}}>
                    Create Grands Prix
                </Button>
            </Grid>
        </Grid>
        <br />
        Hello 
    </div>;
    return TopBar("Class Page, Class: " + location.state.key.className, output); 
}

export default TeacherClassPage;