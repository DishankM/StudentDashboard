import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../Firebase";
import './style.css'
import toast from "react-hot-toast";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "",
    rollNumber: "",
    dateOfBirth: "",
    gender: null,
    contactNumber: "",
    address: "",
    
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const studentsCollection = collection(db, "students");
    const data = await getDocs(studentsCollection);
    setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
    toast.success("Logout Successfully")
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true); // Set loading state
    try {
      
      const tempStudent = { ...studentData, id: Date.now().toString() };
      
      setStudents((prevStudents) => [...prevStudents, tempStudent]);

      setModalOpen(false);

      // Add the data to Firestore
      const docRef = await addDoc(collection(db, "students"), studentData);
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === tempStudent.id ? { ...student, id: docRef.id } : student
        )
      );
      toast.success("Student Created")
    } catch (error) {
      console.error("Error While adding student:", error);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  // EDIT STUDENT
  const handleEditStudent = (student) => {
    setIsEditMode(true);
    setStudentData(student);
    setModalOpen(true);
  };

  //DELETE STUDENT
  const handleDeleteStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
    fetchStudents();
  };


  const handleSaveStudent = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true); // Set loading state
    try {
      // Update the data in Firestore
      const studentRef = doc(db, "students", studentData.id);
      await updateDoc(studentRef, studentData);

      // Update the UI
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentData.id ? studentData : student
        )
      );
      setIsEditMode(false);
      setModalOpen(false);
    } catch (error) {
      console.error("Error editing student:", error);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

   //VIEW STUDENT
  const handleViewStudent = (student) => {
    // Navigate to a separate view page 
    navigate(`/students/${student.id}`, { state: { student } }); 
  };

  const genders = ['Male', 'Female', "Non-Binary", "Prefer not to say", "Other"]
  return (
    <div className="flex bg-amber-100">
      <div className="w-64 bg-gray-800 text-white h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="w-full p-2 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 p-4 ">
        <h1 className="text-2xl font-bold mb-4">Students</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Add Student
        </button>
        <div className="w-full border justify-self-start">
          <table className="w-full border justify-self-start">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Branch</th>
                <th>Section</th>
                <th>Roll No</th>
                <th>College</th>
                <th>City</th>
                <th>Gender</th>
                <th>dateOfBirth</th>
                
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border ">
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>{student.branch}</td>
                  <td>{student.section}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.college}</td>
                  <td>{student.city}</td>
                  <td>{student.gender}</td>
                  <td>{student.dateOfBirth}</td>
                  
                  <td className="space-x-1.5">
                    <button
                      onClick={() => handleViewStudent(student)}
                      className="rounded-2xl text-xl bg-amber-400 py-1 px-1 my-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="rounded-2xl text-xl bg-amber-400 py-1 px-1 my-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="rounded-2xl text-xl bg-amber-400 py-1 px-1 my-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
            <div className="bg-white p-4 rounded">
              <h2 className="text-xl font-bold mb-4">
                {isEditMode ? "Edit Student" : "Add Student"}
              </h2>
              <form onSubmit={isEditMode ? handleSaveStudent : handleAddStudent} className="w-[280px] flex flex-col gap-1">
                <div className="mb-6">
                  <label className="block text-gray-700">Name:</label>
                  <input
                    type="text"
                    value={studentData.name || ""}
                    onChange={(e) =>
                      setStudentData({ ...studentData, name: e.target.value })
                    }
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Class:</label>
                  <input
                    type="text"
                    value={studentData.class || ""}
                    onChange={(e) =>
                      setStudentData({ ...studentData, class: e.target.value })
                    }
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Branch:</label>
                  <input
                    type="text"
                    value={studentData.branch || ""}
                    onChange={(e) =>
                      setStudentData({ ...studentData, branch: e.target.value })
                    }
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Section:</label>
                  <input
                    type="text"
                    value={studentData.section || ""}
                    onChange={(e) =>
                      setStudentData({ ...studentData, section: e.target.value })
                    }
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Roll No:</label>
                  <input
                    type="number"
                    value={studentData.rollNumber || ""}
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        rollNumber: e.target.value,
                      })
                    }
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">College:</label>
                  <input
                    type="text"
                    value={studentData.college || ""}
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        college: e.target.value,
                      })
                    }
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">City:</label>
                  <input
                    type="text"
                    value={studentData.city || ""}
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        city: e.target.value,
                      })
                    }
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                {/* Gender */}
            <div className='flex flex-col w-[48%] p-1'>
              <label htmlFor="gender" className='label-style'>Gender</label>
              <select type="text" name='gender' id='gender'
              className='form-style'
              value={studentData.gender || ""}
              onChange={(e) => {
                setStudentData({
                  ...studentData, 
                  gender: e.target.value,
                })
              }}>
                {
                  genders.map((ele, i) => {
                    return(
                      <option value={ele} key={i}>
                        {ele}
                      </option>
                    )
                  })
                }
              </select>
             
            </div>

            <div className="mb-3">
            <input
            type="date"
            value={studentData.dateOfBirth || ""}
            onChange={(e) =>
              setStudentData({ ...studentData, dateOfBirth: e.target.value })
            }
            required
            className="p-2 border rounded"
          />
        </div>


                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="p-2 mr-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded"
                  >
                    {isEditMode ? "Save" : "Submit"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;