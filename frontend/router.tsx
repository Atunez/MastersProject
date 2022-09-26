import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestStuff from "./App";
import InputTestCases from "./InputTestCases";
import InvalidUser from "./InvalidUser";
import Login from "./Login";
import Logout from "./Logout";
import TeacherPage from "./TeacherPage";
import StudentPage from "./UserPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestStuff />} />
        <Route path="/addTestCases" element={<InputTestCases />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/UnauthenticatedUser" element={<InvalidUser />} />
        <Route path="/TeacherPage" element={<TeacherPage />} />
        <Route path="/StudentPage" element={<StudentPage />} />
        <Route path="/Logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}


