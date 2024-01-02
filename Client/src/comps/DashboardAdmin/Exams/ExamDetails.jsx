import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useParams } from "react-router-dom";
import AddExamSubject from "./AddExamSubject";
import Loader from "../../../Loader";
import { localDateString } from "../../Dashboard/DashboardData";
import Alert from "../../Utilities/Alert";
import ExamSubjectsEdit from "./ExamSubjectsEdit";
import ConfirmDelete from "../../Utilities/ConfirmDelete";

function ExamDetails() {
  const { examId } = useParams();
  const [examDetails, setExamDetails] = useState(null);
  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [editSubjectModal, setEditSubjectModal] = useState({
    open: false,
    subjectId: null,
  });
  const [deleteExamSubject, setDeleteExamSubject] = useState({
    open: false,
    id: null,
  });

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchExams(examId);
  }, [examId]);

  const fetchExams = async (examId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exams/get-exam/${examId}`
      );

      const data = await response.data;
      //   console.log(data);

      setExamDetails(data);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  };

  const handleDeleteExamSubject = async (subjectId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/exams/delete/exam-subject/${examId}/${subjectId}`
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

  if (examDetails === null) {
    return <Loader />;
  }

  return (
    <div>
      <h2>Exam Details For {examDetails && examDetails[0]?.title}</h2>

      <button className="mb-8" onClick={() => setAddSubjectModal(true)}>
        Add Subject To Exam
      </button>
      {/* {examDetails && (
        <div>
          <h3>
            <span>Exam Title: </span>
            {examDetails && examDetails[0]?.title}
          </h3>
        </div>
      )} */}

      {examDetails && examDetails.length < 1 ? (
        <p>There are no exams available at this time!</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>##</th>
                <th>Subject</th>
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
                examDetails?.map((item, i) => (
                  <tr key={item.subject_code}>
                    <td>{i + 1}</td>
                    <td>{item.subject_name}</td>
                    <td>{item.subject_code}</td>
                    <td>{item.class_name}</td>
                    <td>{localDateString(item.exam_date)}</td>
                    <td>{item.start_time.toString()}</td>
                    <td>{item.duration}</td>
                    <td>{item.no_of_questions}</td>
                    <td>{item.total_marks}</td>
                    <td className="flex justify-center gap-4">
                      <FaEdit
                        className="w-6 h-6 text-green-400 cursor-pointer"
                        onClick={() =>
                          handleEditSubjectModal(item.subject_code)
                        }
                      />
                      <MdDeleteForever
                        className="w-6 h-6 text-red-700 cursor-pointer"
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
