import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CreateGrandsPrix(){
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      if(location.state === null){
        navigate("/TeacherPage")
      }
    }, [])
    return (
        <div>
            Start...
        </div>
    )
}

export default CreateGrandsPrix;