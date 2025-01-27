import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentsPage from "./pages/StudentsPage";
import StudentView from "./pages/StudentView";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
          path="/students"
          element={
            <PrivateRoute>
              <StudentsPage />
            </PrivateRoute>
          }
        />
      <Route path="/students/:id" element={<StudentView />} />
    </Routes>
  </Router>
  );
}

export default App;
