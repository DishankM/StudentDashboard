import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StudentView = () => {
  const location = useLocation();
  const student = location.state?.student;
  const navigate = useNavigate()
 
  if (!student) {
    return <div>Student not found.</div>;
  }
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="p-4 bg-amber-100 justify-center items-center w-[1800px] mt-5 ">
      <h2 className="text-2xl font-bold mb-4 ml-60">Student Details:</h2>
      <div className='ml-80 mt-6'> 
        <p><strong>ID:</strong> {student.id}</p>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Class:</strong> {student.class}</p>
        <p><strong>Name:</strong> {student.branch}</p>
        <p><strong>Section:</strong> {student.section}</p>
        <p><strong>Roll Number:</strong> {student.rollNumber}</p>
        <p><strong>Roll Number:</strong> {student.college}</p>
        <p><strong>Roll Number:</strong> {student.city}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <p><strong>dateOfBirth:</strong> {student.dateOfBirth}</p>
        
      </div>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default StudentView;