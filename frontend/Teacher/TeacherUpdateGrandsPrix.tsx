import { Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField } from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
    const submitNewPrix = e => {
      console.log(handleCheck);
      axios.post('http://localhost:9000/classes/updatePrix', {
        classKey: classObj.classKey,
        assignmentList: classAssignments.filter((e, i) => handleCheck[i]),
        startdate: startDate?.toString(),
        enddate: endDate?.toString()
      }).then(e => console.log(e))
    }
    return (
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
        </div>
    )
}

export default UpdateGrandsPrix;