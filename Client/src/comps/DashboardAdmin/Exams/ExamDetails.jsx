/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddExamSubject from "./AddExamSubject";
import Loader from "../../../Loader";
import Alert from "../../Utilities/Alert";
import ExamSubjectsEdit from "./ExamSubjectsEdit";
import ConfirmDelete from "../../Utilities/ConfirmDelete";
import { useUser } from "../../../Contexts/UserContext";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { baseURL, localDateString } from "../../Dashboard/DashboardData";

const edit = {
  open: false,
  subjectId: null,
};
const deleteSubject = {
  open: false,
  id: null,
};

function ExamDetails() {
  const { examId } = useParams();
  const [examDetails, setExamDetails] = useState([]);
  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [editSubjectModal, setEditSubjectModal] = useState(edit);
  const [deleteExamSubject, setDeleteExamSubject] = useState(deleteSubject);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [publishModal, setPublishModal] = useState(false);
  const { isLoading, setIsLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams(examId);
  }, [examId]);

  const fetchExams = async (examId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/exams/exam-details/draft/${examId}`
      );

      const data = response.data;

      setExamDetails(data);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Publish exam for student interaction
  const handlePublishExam = async () => {
    try {
      const response = await axios.post(`${baseURL}/exams/publish/${examId}`);

      const data = response.data;
      console.log(data);

      setMessage(data.message);
      setType(data.type);
      setShowAlert(true);
      setPublishModal(false);
      navigate(-1);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  };

  const handleDeleteExamSubject = async (subjectId) => {
    try {
      const response = await axios.delete(
        `${baseURL}/exams/delete/exam-subject/${examId}/${subjectId}`
      );

      const data = response.data;
      console.log(data);

      setMessage(data.message);
      setType(data.type);
      setShowAlert(true);
      setDeleteExamSubject({ open: false, id: null });
      fetchExams(examId);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  };

  const handleEditSubjectModal = (subjectId) => {
    setEditSubjectModal({ open: true, subjectId: subjectId });
  };

  const handleDeleteSubjectModal = (subjectId) => {
    setDeleteExamSubject({ open: true, id: subjectId });
  };

  return (
    <div>
      <header className="header">
        <div>
          {examDetails.length > 0 ? (
            <p>{examDetails.length} subjects added to this exam</p>
          ) : (
            <p>Add Subjects to this exam!</p>
          )}
          <h2 className="m-0 text-3xl font-semibold">
            {examDetails[0]?.title} Details
          </h2>
        </div>

        <div className="flex gap-4">
          <button
            className="btn-black"
            onClick={() => setAddSubjectModal(true)}
          >
            Add Subject
          </button>
          <button
            className="bg-red-600"
            onClick={() => setShowInstructions(true)}
          >
            View Instructions
          </button>
          {examDetails.length >= 1 && (
            <button
              className="bg-green-600"
              onClick={() => setPublishModal(true)}
            >
              Publish
            </button>
          )}
        </div>
      </header>

      {/* Exam Instructions */}
      {showInstructions && (
        <ExamInstructions onShowInstructions={setShowInstructions} />
      )}

      {/* Table Display */}
      {isLoading ? (
        <Loader />
      ) : examDetails.length < 1 ? (
        <p>There are no subjects available in this exam!</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>##</th>
                <th className="text-left pl-5">Subject</th>
                <th>Code</th>
                <th>Class</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>No. of Questions</th>
                <th>Total Marks</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {examDetails &&
                examDetails.map((item, i) => (
                  <tr key={item.subject_code}>
                    <td>{i + 1}</td>
                    <td className="text-left pl-5">{item.subject_name}</td>
                    <td>{item.subject_code}</td>
                    <td>{item.class_name}</td>
                    <td>{localDateString(item.exam_date)}</td>
                    <td>{item.start_time.toString()}</td>
                    <td>{item.duration}</td>
                    <td>{item.no_of_questions}</td>
                    <td>{item.total_marks}</td>
                    <td className="flex justify-center gap-4">
                      <FaEdit
                        className="w-6 h-6 text-green-600 cursor-pointer"
                        onClick={() =>
                          handleEditSubjectModal(item.subject_code)
                        }
                      />
                      <MdDeleteForever
                        className="w-6 h-6 text-red-600 cursor-pointer"
                        onClick={() =>
                          handleDeleteSubjectModal(item.subject_code)
                        }
                        // onClick={() => deleteExam(item.subject_code)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {addSubjectModal && (
        <>
          <div className="modal-backdro"></div>
          <AddExamSubject
            examId={examId}
            onModalClose={() => setAddSubjectModal(false)}
            fetchExam={fetchExams}
            onSetMessage={setMessage}
            onSetType={setType}
            onShowAlert={setShowAlert}
          />
        </>
      )}

      {editSubjectModal.open && (
        <ExamSubjectsEdit
          examId={examId}
          onModalClose={() =>
            setEditSubjectModal({ open: false, subjectId: null })
          }
          fetchExam={fetchExams}
          onSetMessage={setMessage}
          onSetType={setType}
          onShowAlert={setShowAlert}
          subjectId={editSubjectModal.subjectId}
        />
      )}

      {deleteExamSubject.open && (
        <ConfirmDelete
          item="subject"
          onCancel={() => setDeleteExamSubject({ open: false, id: null })}
          onDelete={() => handleDeleteExamSubject(deleteExamSubject.id)}
        />
      )}

      {publishModal && (
        <PublishModal
          onModalOpen={setPublishModal}
          onPublishExam={handlePublishExam}
        />
      )}

      <Alert
        type={type}
        message={message}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
}

export default ExamDetails;

// Instructions for exam
export const ExamInstructions = ({ onShowInstructions }) => {
  return (
    <article>
      <div>
        <div className="modal-backdrop"></div>
        <div className="modal flex flex-col gap-6 items-start">
          <h3 className="text-2xl font-semibold border-b-2 border-red-600 w-full pb-2">
            Exam Instructions
          </h3>
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>
              All exams must be created within the school time (8:30 AM - 12:15
              PM).
            </li>
            <li>
              It is advisable to set exams for a class at 8:30 AM and 11:00 AM.
            </li>
            <li>
              The Minimum and Maximum duration for an exam is 30 and 45 minutes
              respectively.
            </li>
            <li>
              Only a single instance of a subject can be added to an exam.
            </li>
            <li>Classes can only have two (2) exams per day.</li>
            <li>
              Check exam dates and time when adding subjects to avoid potential
              conflicts in a class.
            </li>
            <li>
              Ensure that two separate exams do not fall on the same date and
              time in a class
            </li>
            <li>All exams must be scheduled a day after the current date</li>
            <li>
              After adding subjects, publish exam for students to attempt based
              on their classes.
            </li>
          </ol>
          <button
            className="bg-red-600 text-white"
            onClick={() => onShowInstructions(false)}
          >
            Close
          </button>
        </div>
      </div>
    </article>
  );
};

// Publish exam dialog
export const PublishModal = ({ onModalOpen, onPublishExam }) => {
  return (
    <div className="w-[400px]">
      {" "}
      <div className="modal-backdrop"></div>
      <div className="modal flex flex-col items-center w-[600px]">
        <div className="flex gap-4 items-start">
          <PiWarningCircleFill className="h-12 w-12 text-yellow-400" />
          <div>
            <p className="font-semibold text-lg">
              Are you sure you want to publish this exam?
            </p>
            <p className="text-sm btn-danger mb-8">
              After publishing, students will be able to take the subjects based
              on their classes.
            </p>
          </div>
        </div>

        <footer className="flex gap-4">
          <button className="bg-red-600" onClick={() => onModalOpen(false)}>
            Deny
          </button>
          <button className="bg-green-600" onClick={onPublishExam}>
            Confirm
          </button>
        </footer>
      </div>
    </div>
  );
};
