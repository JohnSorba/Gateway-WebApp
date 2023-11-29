/* eslint-disable react/prop-types */
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import SubjectUpdate from "./SubjectUpdate";
import { useState } from "react";
import "./Timetable.css";

function SubjectItem({ subjects, onDelete, onUpdate }) {
  const [editingSubject, setEditingSubject] = useState(null);
  const [message, setMessage] = useState(null);

  // handle Delete
  const handleDelete = async (subjectId) => {
    try {
      await axios.delete(
        `http://localhost:3000/timetable/subjects/${subjectId}`
      );

      onDelete();
    } catch (error) {
      console.error("Error deleting subject: ", error);
    }
  };

  const startEditing = (subject) => {
    setEditingSubject(subject);
  };

  const updateSubject = async (subjectId, updatedSubject) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/timetable/subjects/${subjectId}`,
        updatedSubject
      );
      onUpdate();

      if (response.data) {
        setEditingSubject(null);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error updating subject", error);
      setMessage(error.response.data.error);
    }
  };

  const cancelEditing = () => {
    setEditingSubject(null);
  };

  return (
    <div>
      <h3 className="mb-4 text-lg">Total Subjects: {subjects.length}</h3>
      <ul className="flex flex-col gap-1">
        <li className="grid grid-cols-[30px_80px_1fr] gap-3 font-semibold mb-2">
          <span>No.</span>
          <p>Code</p>
          <p>Subject Name</p>
        </li>
        {editingSubject && (
          <>
            <div className="modal-backdrop"></div>

            <SubjectUpdate
              subject={editingSubject}
              onSave={updateSubject}
              onCancel={cancelEditing}
            />
          </>
        )}

        {/* Edit subject, Otherwise display subjects */}
        {subjects?.map((subject, index) => (
          <li
            key={subject.subject_code}
            className="grid grid-cols-[30px_100px_1fr_25px_25px] gap-3 items-center border-b-2 pb-1"
          >
            <span className="font-semibold">{index + 1}</span>
            <p className="text-[13px] font-semibold">{subject.subject_code}</p>
            <p>{subject.subject_name}</p>
            <FaEdit
              className="h-5 w-5 text-blue-400 cursor-pointer"
              onClick={() => startEditing(subject)}
            />
            <MdDeleteForever
              className="h-5 w-5 text-red-500 cursor-pointer hover:bg-red-50"
              onClick={() => handleDelete(subject.id)}
            />
          </li>
        ))}
      </ul>
      <p>{message}</p>
    </div>
  );
}

export default SubjectItem;
