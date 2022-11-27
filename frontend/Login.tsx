import { useEffect } from 'react';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

declare var google: any;

// Information to pull out from the user...
interface  GoogleToken {
    hd: String,
    email: String,
    family_name: String,
    given_name: String
}

function Login(){
    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["userType", "userEmail", "firstName", "lastName"]);

    function HandleUserLogin(resp: any){
        // Need to store this in a cookie...
        // So that when people try to go to other pages, they cant...
        const userObj = jwt_decode<JwtPayload & GoogleToken>(resp['credential']);
        // we have the user now...
        // if the user isn't from AppState, then we can kick them out...
        var goTo = "/UnauthenticatedUser";
        var userType = "Unauthenticated";
    
        if(userObj.hd != "appstate.edu" && userObj.email != "nametaken1010@gmail.com" && userObj.email != "nametaken102@gmail.com"){
            goTo = "/UnauthenticatedUser";
        }else{
            // If the user is a teacher...
            if(userObj.email == "issaa@appstate.edu"){
                goTo = "/TeacherPage"
                userType = "Teacher";
            }else{
                goTo = "/StudentPage"
                userType = "Student";
            }
        }
        setCookie("userType", userType, {path: "/"});
        setCookie("userEmail", userObj.email, {path: "/"});
        setCookie("firstName", userObj.given_name, {path: "/"});
        setCookie("lastName", userObj.family_name, {path: "/"});
        navigate(goTo);
    }

    useEffect(() => {
        // If the userType is set, then we logged in before...
        switch(cookies.userType){
            case "Student":
                navigate("/UserPage");
            case "Teacher":
                navigate("/TeacherPage");
        }

        google.accounts.id.initialize({
            client_id: "1048066569973-u43tqpg5a7u0ghvahbks3qtleg9jj6i3.apps.googleusercontent.com",
            callback: HandleUserLogin
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {theme: "outline", size: "large"}
        );
    },[])
    


    return (
        <div className="login">
            <div id="signInDiv"></div>
        </div>
    )
}

export default Login;