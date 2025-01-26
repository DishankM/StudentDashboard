import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentsPage from "./pages/StudentsPage";
import StudentView from "./pages/StudentView";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/students/:id" element={<StudentView />} />
    </Routes>
  </Router>
  );
}

export default App;
