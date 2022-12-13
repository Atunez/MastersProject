import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentClassPage from "./Student/StudentClassPage";
import InputTestCases from "./Teacher/InputTestCases";
import InvalidUser from "./InvalidUser";
import Login from "./Login";
import Logout from "./Logout";
import TeacherPage from "./Teacher/TeacherPage";
import StudentPage from "./Student/StudentPage";
import TeacherClassPage from "./Teacher/TeacherClassPage";
import GetProblemPage from "./Student/StudentProblemPage";
import MainPage from "./MainPage";
import GrandsPrix from "./Teacher/TeacherUpdateGrandsPrix";
import ShowGrandsPrix from "./ShowGrandsPrix";
import { useState } from "react";

export function DarkModeInfo() {
  const [darkMode, setDarkMode] = useState(false)
  const switchDM = () => {setDarkMode(!darkMode)}
  if(darkMode){
    document.documentElement.classList.add('dark')
  }else{
    document.documentElement.classList.remove('dark')
  }
  return switchDM
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/createProblem" element={<InputTestCases />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/UnauthenticatedUser" element={<InvalidUser />} />
        <Route path="/TeacherPage" element={<TeacherPage />} />
        <Route path="/StudentPage" element={<StudentPage />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/GrandsPrix" element={<GrandsPrix />} />
        <Route path="/ShowGrandsPrix" element={<ShowGrandsPrix />} />
        <Route path="/student/:classKey" element={<StudentClassPage />} />
        <Route path="/teacher/:classKey" element={<TeacherClassPage />} />
        <Route path="/student/problem/:pid" element={<GetProblemPage />} />
      </Routes>
    </BrowserRouter>
  );
}


