import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function StudentPage(){
    const [cookies, setCookie] = useCookies();
    let navigate = useNavigate();

    useEffect(() => {
        if(cookies.userType != "Student"){
            navigate("/UnauthenticatedUser");
        }     
    }, []);

    return (
        <div className="StudentPage">
            Student Page
        </div>
    )
}

export default StudentPage;