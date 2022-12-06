import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardActionArea, CardContent, Grid, ListItem, ListItemText, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../ElementWrapper";
import dayjs, { Dayjs } from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCookies } from "react-cookie";

function StudentClassPage(e){
    const [cookies, setCookie] = useCookies();
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

    console.log(location.state.key)

    const output = (        
    <div className="ClassCards">
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <Button variant="contained" onClick={e => {navigate("/showGrandsPrix", { state: {key: location.state.key}})}}> Show Prix </Button>
    </div>    
    <h2>
    Assignments:
    </h2>
        {location.state.key.assignments.sort((a, b) => {return dayjs(a.endTime).unix() - dayjs(b.endTime).unix()}).map(pobj => {
            const toDisplayBefore = dayjs().isBefore(dayjs(pobj.startTime));
            const toDisplayAfter = dayjs().isAfter(dayjs(pobj.endTime));
            const studentRecord = pobj.grades.find(e => {return e.name == cookies.fullName});
            var dueDateError = <></>;
            var dateToDisplay = (<>
                Due Date: {pobj.endTime}
            </>)
            var contentsInAccord = <></>;

            if(toDisplayBefore){
                dueDateError = (<>
                    Assignment Isn't Open Yet
                </>);
                dateToDisplay = (<>
                    Start Date: {pobj.startTime}
                </>)
                contentsInAccord = (<>
                    This Assignment will be opened later.
                    When Opened, Clicking on the card will direct you to the problem page.
                </>);
            }else if(toDisplayAfter){
                dueDateError = (<>
                    Assignment Is Past Due Date
                </>);
                if(studentRecord == undefined){
                    contentsInAccord = (<>
                        No Submission
                    </>)
                }else{
                    contentsInAccord = (<>
                        <ListItem sx={{display:'flex', justifyContent:'flex-end'}}>
                            <ListItemText primary={<a href={window.URL.createObjectURL(new Blob([e.code], {type: 'text/plain'}))} download={studentRecord.name + "_" + pobj.aid + ".txt"}> Download Your Submission </a>} />
                            Score: {studentRecord.grade}
                        </ListItem>
                    </>)
                }
            }

            const summary = (<>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {pobj.aid}
                </Typography>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {dueDateError}
                </Typography>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {dateToDisplay}
                </Typography>
                </>
             );    
            return (<><Accordion onClick={e => {if(!(toDisplayBefore || toDisplayAfter)){ cardClicked(pobj.aid) }}}>
                <AccordionSummary expandIcon={toDisplayBefore || toDisplayAfter ? <ExpandMoreIcon /> : <></>}>
                    {summary}
                </AccordionSummary>
                <AccordionDetails>
                    <Typography> 
                        {contentsInAccord}
                    </Typography>
                </AccordionDetails>
            </Accordion><br/></>
            )}
        )}
</div>)
return TopBar("Class Page, Class: " + location.state.key.className, output);
}

export default StudentClassPage;