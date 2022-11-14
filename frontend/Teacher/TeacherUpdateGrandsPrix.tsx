import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UpdateGrandsPrix(){
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      if(location.state === null){
        navigate("/TeacherPage")
      }
    }, [])

    const classObj = location.state.key;
    const classAssignments = classObj.assignments;

    console.log(classAssignments);
    // Figure out which phase we are in...
    // 

    return (
        <div>
            Start...
            Get Assignment List
            Box for start and end, then we are done...
        </div>
    )
}

export default UpdateGrandsPrix;