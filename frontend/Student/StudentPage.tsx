import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import GetClassCards from "../ClassCards";
import TopBar from "../ElementWrapper";

function StudentPage(){
    const [cookies, setCookie] = useCookies();
    let navigate = useNavigate();

    const [classKey, setClassKey] = useState("");
    const [classPwd, setClassPwd] = useState("");
    const [classCards, setClassCards] = useState<any>();

    useEffect(() => {
        if(cookies.userType != "Student"){
            navigate("/UnauthenticatedUser");
        }
        getNewClassCards();
    }, []);

    const getClassInfo = (key) => {
        return new Promise((resolve, reject) => {
            axios.put("http://localhost:9000/classes/findClass", { classKey: key }).then(res => resolve(res["data"]["classInfo"][0])).catch(res => reject(res))
        });
    }

    const getNewClassCards = () => {
        axios.post('http://localhost:9000/user/getUserClasses', {
            isTeacher: cookies.userType === "Teacher",
            instructor: cookies.fullName,
            email: cookies.userEmail
            }).then((res) => {Promise.all(res["data"]["classesInfo"].map(getClassInfo)).then(res => setClassCards(GetClassCards(res, classRoomClicked)))})        
    }

    const handleJoinClass = e => {
        if(classKey == "" || classPwd == ""){
            return;
        }
        axios.put("http://localhost:9000/user/addClassToUser", {
            email: cookies.userEmail,
            firstName: cookies.firstName,
            lastName: cookies.lastName,
            classKey: classKey,
            password: classPwd
        }).then((res) => {console.log(res); getNewClassCards();});
    }

    const classRoomClicked = (classObj) => {
        navigate("/student/" + classObj.classKey, { state: {key: classObj}});
    }

    const output = (
        <div className="StudentPage">
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}>
                <div>
                    <TextField
                        required
                        id="class-key"
                        label="Class Key"
                        value={classKey}
                        onChange={e => setClassKey(e.target.value)}
                        />
                </div>
                <div>
                    <TextField
                        required
                        id="class-pwd"
                        label="Class Password"
                        value={classPwd}
                        onChange={e => setClassPwd(e.target.value)}
                        />    
                </div>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                    <Button variant="contained" onClick={handleJoinClass}> Join Class </Button>
                </div>
            </Box>
            </div>
            <br />
            {classCards}
        </div>
    )
    return TopBar("Student Home Page", output);
}

export default StudentPage;