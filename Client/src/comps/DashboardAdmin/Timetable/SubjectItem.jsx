/* eslint-disable react/prop-types */
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import SubjectUpdate from "./SubjectUpdate";
import Alert from "../../Utilities/Alert";
import { useState } from "react";
import "./Timetable.css";
import ConfirmDelete from "../../Utilities/ConfirmDelete";
import { baseURL } from "../../Dashboard/DashboardData";

function SubjectItem({
  subjects,
  onDelete,
  onUpdate,
  showAlert,
  onSetAlert,
  onSetType,
  message,
  onSetMessage,
}) {
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    subjectId: null,
  });

  // handle Delete subject
  const handleDeleteSubject = async (subjectId) => {
    try {
      const response = await axios.delete(
        `${baseURL}/timetable/subjects/${subjectId}`
      );

      setDeleteConfirm({ open: false, subjectId: null });
      onSetMessage(response.data.message);
      onSetType(response.data.type);
      onSetAlert(true);

      onDelete();
    } catch (error) {
      console.error("Error deleting subject: ", error);
    }
  };

  const startEditing = (subject) => {
    setEditingSubject(subject);
    onSetMessage("");
  };

  const updateSubject = async (subjectId, updatedSubject) => {
    // Check if no input is empty
    if (Object.values(updatedSubject).some((value) => value.trim() === "")) {
      onSetMessage("Please fill in all fields!");
      return;
    }

    onSetMessage("");

    try {
      const response = await axios.put(
        `${baseURL}/timetable/subjects/${subjectId}`,
        updatedSubject
      );
      onUpdate();

      console.log(response);

      setEditingSubject(null);

      onSetMessage(response.data.message);
      onSetAlert(true);
      onSetType(response.data.type);
    } catch (error) {
      console.error("Error updating subject", error);
      onSetMessage(error.response.data.message);
      onSetType(error.response.data.type);
    }
  };

  const cancelEditing = () => {
    setEditingSubject(null);
    onSetMessage("");
  };

  const handleCloseAlert = () => {
    onSetAlert(false);
  };

  const handleShowDeleteSubject = (subjectId) => {
    setDeleteConfirm({ open: true, subjectId: subjectId });
  };

  return (
    <div>
      <h3 className="mb-8 text-lg">
        Total Subjects:{" "}
        <span className="font-semibold text-2xl">{subjects.length}</span>
      </h3>
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
              onSetMessage={onSetMessage}
              message={message}
            />
          </>
        )}

        {/* Edit subject, Otherwise display subjects */}
        {subjects?.map((subject, index) => (
          <li
            key={subject.subject_code}
            className="grid grid-cols-[30px_80px_1fr_20px_20px] gap-3 items-center border-b-2 pb-1"
          >
            <span className="font-semibold">{index + 1}</span>
            <p className="text-[13px] font-semibold">{subject.subject_code}</p>
            <p>{subject.subject_name}</p>
            <FaEdit
              className="h-5 w-5 text-blue-400 cursor-pointer"
              onClick={() => startEditing(subject)}
            />
            <MdDeleteForever
              className="h-6 w-6 text-red-500 cursor-pointer hover:bg-red-50"
              onClick={() => handleShowDeleteSubject(subject.subject_code)}
            />
          </li>
        ))}
      </ul>

      {deleteConfirm.open && (
        <ConfirmDelete
          item={deleteConfirm.subjectId}
          onCancel={() => setDeleteConfirm({ open: false, subjectId: null })}
          onDelete={() => handleDeleteSubject(deleteConfirm.subjectId)}
        />
      )}

      <Alert
        type="success"
        message={message}
        isVisible={showAlert}
        onClose={handleCloseAlert}
      />
    </div>
  );
}

export default SubjectItem;
