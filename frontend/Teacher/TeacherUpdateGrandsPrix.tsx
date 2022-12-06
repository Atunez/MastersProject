import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Divider, FormControlLabel, FormGroup, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../ElementWrapper";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function UpdateGrandsPrix(){
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      if(location.state === null){
        navigate("/TeacherPage")
      }
    }, [])

    const classObj = location.state.key;
    console.log(classObj)
    const classAssignments = classObj.assignments;
    const [handleCheck, setHandleCheck] = useState(new Array(classAssignments.length).fill(false));
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(7, 'day'));
    const [userGradeDist, setUserGradeDist] = useState([{start: 1, end: -1, penalty: 0}]);

    const submitNewPrix = e => {
      console.log(handleCheck);
      axios.post('http://localhost:9000/classes/updatePrix', {
        classKey: classObj.classKey,
        assignmentList: classAssignments.filter((e, i) => handleCheck[i]),
        startdate: startDate?.toString(),
        enddate: endDate?.toString(),
        gradeInfo: JSON.stringify(userGradeDist)
      }).then(e => console.log(e))
    }

    const [start, setStart] = useState(2)
    const [next, setNext] = useState(0)
    const [penalty, setPenalty] = useState(0)

    const handleAddingBound = e => {
      if(start <= 0 || next <= 0 || penalty <= 0 ){
        return;
      }
      // Given a new bound, change the previous bound
      // and add the new one
      const newGrade = [...userGradeDist]
      const prevGradeIdx = newGrade.length - 1
      // Previous needs new...
      if(next <= newGrade[prevGradeIdx].start){
        return;
      }
      newGrade[prevGradeIdx].end = next-1
      const newUserGradeDis = userGradeDist.concat([{start: next, end: -1, penalty: penalty}])
      setStart(next)
      setNext(next+1)
      setPenalty(penalty+1)
      setUserGradeDist(newUserGradeDis)
    }

    const output = (
        <div>
            Select Assignments to put in this prix's round:
            <br />
            {classAssignments.map((assObj, idx) => {
              return (<div>
                        <FormGroup>
                          <FormControlLabel control={<Checkbox checked={handleCheck[idx]} onChange={e => {const t = [...handleCheck]; t[idx] = !t[idx]; setHandleCheck(t);}} />} label={assObj.aid} />
                        </FormGroup>                
                      </div>);
            })}
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <br />
            <Button variant="contained" onClick={submitNewPrix}>
                Update Grands Prix
            </Button>
            <br />
            <br />

            <Accordion>
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}> Grading Bounds </Typography>
              </AccordionSummary>
              <AccordionDetails>
                  For Students who solved within i, but less than j. Apply k. Range Incluse, start at 1.
                  <br />
                  <br />
                  <List component="nav">
                    {userGradeDist.map((e, i) => {
                      return (<><ListItem>
                        <Grid container direction="row" justifyContent="space-evenly">
                          <Grid item>
                            Start cutoff (Student Starting at): {e.start} 
                          </Grid>
                          <Grid item>
                            End cutoff (Student Ending at): {e.end} 
                          </Grid>
                          <Grid item>
                            Penalty: {e.penalty} 
                          </Grid>
                        </Grid>
                      </ListItem>
                      <Divider /></>)
                    })}
                  </List>
                  <br />
                  <TextField type="number" id="endVal" label="Next Bound" value={next} onChange={e => setNext(parseInt(e.target.value))} />
                  <TextField type="number" id="penVal" label="Penalty" value={penalty} onChange={e => setPenalty(parseInt(e.target.value))} />
                  <Button variant="contained" onClick={handleAddingBound}> Add New Bound </Button>
                  <Button variant="contained" onClick={e => {
                    if(userGradeDist.length == 1){
                      return;
                    }
                    const temp = [...userGradeDist]
                    temp.pop()
                    setUserGradeDist(temp)
                  }}> Remove Last Bound </Button>
                  <Button variant="contained" onClick={e => {setUserGradeDist([{start: 1, end: -1, penalty: 0}])}}> Clear Bounds </Button>

              </AccordionDetails>
            </Accordion>
        </div>
    )
    return TopBar("Update Prix", output);
}

export default UpdateGrandsPrix;