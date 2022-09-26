import { useEffect } from 'react';
import { useCookies } from "react-cookie";


function Logout(){
    const [cookies, setCookie, removeCookie] = useCookies();

    useEffect(() => {
        removeCookie("userType")
        removeCookie("userEmail")
    }, [])
    return (
        <div className="Logout">
            Logged Out...
        </div>
    )
}

export default Logout;