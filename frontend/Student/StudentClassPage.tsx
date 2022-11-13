import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";


function StudentClassPage(e){
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.state.key)
    console.log(e)

    if(location.state.key.assignments.length == 0){
        console.log("Empty Assingments")
    }

    const cardClicked = (pname) => {
        navigate("/student/problem/" + pname, { state: {key: location.state.key.classKey, pid: pname}})
    }

    return (        <div className="ClassCards">
    <Grid container spacing={3}>
        {location.state.key.assignments.map(pname => {return (<Grid item xs={12}> 
            <Card sx={{ maxWidth: 345 }}> 
                <CardActionArea onClick={e => cardClicked(pname)}>
                    <CardContent>
                        <Typography>
                            {pname}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>)})}
    </Grid>
</div>)
}

export default StudentClassPage;