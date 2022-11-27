import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormHelperText, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import GetClassCards from "../ClassCards";

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
            instructor: "GetFromCookie",
            email: cookies.userEmail
            }).then((res) => {Promise.all(res["data"]["classesInfo"].map(getClassInfo)).then(res => setClassCards(GetClassCards(res, classRoomClicked)))})        
    }

    const handleJoinClass = e => {
        axios.put("http://localhost:9000/user/addClassToUser", {
            email: cookies.userEmail,
            firstName: "Test",
            lastName: "User 2",
            classKey: classKey,
            password: classPwd
        }).then((res) => {console.log(res); getNewClassCards();});
    }

    const classRoomClicked = (classObj) => {
        navigate("/student/" + classObj.classKey, { state: {key: classObj}});
    }

    return (
        <div className="StudentPage">
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
                <div>
                    <Button variant="contained" onClick={handleJoinClass}> Join Class </Button>
                </div>
            </Box>
            {classCards}
        </div>
    )
}

export default StudentPage;