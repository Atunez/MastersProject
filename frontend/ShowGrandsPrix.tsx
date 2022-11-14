import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ShowGrandsPrix(){
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      if(location.state === null){
        navigate("/TeacherPage")
      }
    }, [])

    // Figure out which phase we are in...
    // 

    return (
        <div>
            Start...
        </div>
    )
}

export default ShowGrandsPrix;