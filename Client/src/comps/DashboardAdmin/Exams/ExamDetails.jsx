import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useParams } from "react-router-dom";
import AddExamSubject from "./AddExamSubject";
import Loader from "../../../Loader";

function ExamDetails() {
  const { examId } = useParams();
  const [examDetails, setExamDetails] = useState(null);
  const [addSubjectModal, setAddSubjectModal] = useState(false);

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

  if (!examDetails) {
    return <Loader />;
  }

  return (
    <div>
      <h2>Exam Details</h2>

      <button className="form-button" onClick={() => setAddSubjectModal(true)}>
        Add Subject To Exam
      </button>
      {examDetails && (
        <div>
          <h3>
            <span>Exam Title: </span>
            {examDetails[0]?.title}
          </h3>
          {/* Display other details */}
        </div>
      )}

      {examDetails.length < 1 ? (
        <p>There are no exams available at this time!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>No. of Questions</th>
              <th>Total Marks</th>
              <th>Exam Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {examDetails?.map((item) => (
              <tr key={item.subject_code}>
                <td>{item.subject_code}</td>
                <td>{item.exam_date}</td>
                <td>{item.start_time.toString()}</td>
                <td>{item.duration}</td>
                <td>{item.no_of_questions}</td>
                <td>{item.total_marks}</td>
                <td>{item.exam_type}</td>
                <td className="flex gap-4">
                  <FaEdit className="w-6 h-6 text-green-400" />
                  <MdDeleteForever className="w-6 h-6 text-red-700" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {addSubjectModal && (
        <>
          <div className="modal-backdro"></div>
          <AddExamSubject
            examId={examId}
            onModalClose={setAddSubjectModal}
            fetchExams={fetchExams}
          />
        </>
      )}
    </div>
  );
}

export default ExamDetails;
