// Given if the current person is a student or teacher
// Generate the correct list of class cards for the main screen
import { useCookies } from "react-cookie";

function TeacherPage(){
    const [cookies, setCookie] = useCookies();
    // Teacher's card have more information...
    const isTeacher = cookies.userType == "Teacher";
    


    return (
        <div className="TeacherPage">
            Teacher Page
        </div>
    )
}

export default TeacherPage;