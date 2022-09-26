import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function TeacherPage(){
    const [cookies, setCookie] = useCookies();
    let navigate = useNavigate();

    useEffect(() => {
        if(cookies.userType != "Teacher"){
            navigate("/UnauthenticatedUser");
        }     
    }, []);

    return (
        <div className="TeacherPage">
            Teacher Page
        </div>
    )
}

export default TeacherPage;