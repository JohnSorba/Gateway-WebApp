import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionEdit from "./QuestionEdit";
import { PiWarningCircleFill } from "react-icons/pi";
import Alert from "../../Utilities/Alert";

function QuestionDetails() {
  const [questionDetails, setQuestionDetails] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState(" ");

  const navigate = useNavigate();

  const { questionId } = useParams();

  // console.log(newQuestions);
  // console.log(questionDetails);
  const question = questionDetails[0];

  useEffect(() => {
    fetchQuestions(questionId);
  }, [questionId]);

  const fetchQuestions = async (questionId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exams/question-details/${questionId}`
      );

      const data = response.data;
      // console.log(data);

      setQuestionDetails(data);
    } catch (error) {
      console.error("Error fetching question details", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/exams/question/delete/${questionId}`
      );

      console.log(response);
      setMessage(response.data);

      navigate("/dashboard/admin/questions");
      setDeleteModal(false);
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting question", error);
    }
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div>
      <h1>Question Details</h1>

      <button className="form-button" onClick={() => setEditModal(true)}>
        Edit Question
      </button>
      <button className="form-button ml-8" onClick={() => setDeleteModal(true)}>
        Delete Question
      </button>

      {questionDetails.map((data) => (
        <div key={data.question_id}>
          <h2>Q: {data.questionText}</h2>
          <p>{data.subjectId}</p>
          <ul>
            <h2>Options</h2>
            {data.options.map((option, i) => (
              <li key={i}>
                Opt {i}: {option}
              </li>
            ))}
          </ul>
          <span>
            Correct Option:{" "}
            {data.correctOption !== null ? (
              data.correctOption
            ) : (
              <span>No Correct Option available</span>
            )}
          </span>
          <p>Question Weight: {data.marks}</p>
        </div>
      ))}

      <p>{message}</p>

      {editModal && (
        <div>
          <div className="modal-backdrop"></div>
          <QuestionEdit
            questionId={questionId}
            onClose={closeEditModal}
            onShowAlert={setShowAlert}
            onSetMessage={setMessage}
            question={question}
          />
        </div>
      )}

      {deleteModal && (
        <div className="modal flex flex-col items-center">
          <div className="flex gap-4 items-start">
            <PiWarningCircleFill className="h-12 w-12 text-red-600" />
            <div>
              <p className="font-semibold text-lg">
                Are you sure you want to delete this question?
              </p>
              <p className="text-sm btn-danger mb-8">
                Upon deletion, you will lose access to all data related to this
                question.
              </p>
            </div>
          </div>

          <footer className="flex gap-4">
            <button
              className="form-button"
              onClick={() => setDeleteModal(false)}
            >
              Deny
            </button>
            <button
              className="bg-red-600"
              onClick={() => handleDeleteQuestion(questionId)}
            >
              Confirm
            </button>
          </footer>
        </div>
      )}
      <Alert
        type="success"
        message={message}
        onClose={handleCloseAlert}
        isVisible={showAlert}
      />
    </div>
  );
}

export default QuestionDetails;
