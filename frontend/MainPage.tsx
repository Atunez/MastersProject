import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import TopBar from "./ElementWrapper";

function MainPage(){
    const [cookies, setCookie] = useCookies(["userType", "userEmail"]);
    let navigate = useNavigate();

    switch(cookies.userType){
        case "Student":
            navigate("/UserPage");
        case "Teacher":
            navigate("/TeacherPage");
    }
    const output = notLoggedIn();
    return TopBar("Home", output)
}

function notLoggedIn(){
    return (
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
            Please Start by Logging In...
        </div>
    )
}

export default MainPage;