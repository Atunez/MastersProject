import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import GetClassCards from "../ClassCards";
import TopBar from "../ElementWrapper";

function TeacherPage(){
    const [cookies, setCookie] = useCookies();
    let navigate = useNavigate();

    const [className, setClassName] = useState("");
    const [classPwd, setClassPwd] = useState("");
    const [classCards, setClassCards] = useState<any>();

    useEffect(() => {
        if(cookies.userType != "Teacher"){
            navigate("/UnauthenticatedUser");
        }     
        getNewClassCards();
    }, []);

    const handleCreateClass = e => {
        axios.post("http://localhost:9000/classes/addClass", {
            className: className,
            password: classPwd,
            instructor: "GetFromCookie"
        }).then((res) => {getNewClassCards()});
    };

    const getNewClassCards = () => {
        axios.post('http://localhost:9000/user/getUserClasses', {
            isTeacher: cookies.userType === "Teacher",
            instructor: "GetFromCookie",
            email: cookies.userEmail
            }).then((res) => {setClassCards(GetClassCards(res["data"]["classesInfo"], classRoomClicked))})        
    }

    const classRoomClicked = (classObj) => {
        navigate("/teacher/" + classObj.classKey, { state: {key: classObj}});
    }


    const output = (
        <div className="TeacherPage">
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}>
                    <div>
                        <TextField
                            required
                            id="class-key"
                            label="Class Name"
                            value={className}
                            onChange={e => setClassName(e.target.value)}
                            />
                    </div>
                    <div>
                        <TextField
                            required
                            id="class-passwd"
                            label="Class Password"
                            value={classPwd}
                            onChange={e => setClassPwd(e.target.value)}
                            />
                    </div>
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <Button variant="contained" onClick={handleCreateClass}> Create Class </Button>
                    </div>
                </Box>
            </div>
            <br />
            <br />
            {classCards}
        </div>
    );
    return TopBar("Teacher Home Page", output);
}

export default TeacherPage;