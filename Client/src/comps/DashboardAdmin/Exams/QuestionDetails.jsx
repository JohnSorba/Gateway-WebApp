import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionEdit from "./QuestionEdit";
import Alert from "../../Utilities/Alert";
import ConfirmDelete from "../../Utilities/ConfirmDelete";
import { useUser } from "../../../Contexts/UserContext";
import Loader from "../../../Loader";

function QuestionDetails() {
  const [questionDetails, setQuestionDetails] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState(" ");
  const [type, setType] = useState("");
  const { isLoading, setIsLoading } = useUser();

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
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/exams/question-details/${questionId}`
      );

      const data = response.data;
      // console.log(data);

      setQuestionDetails(data);
    } catch (error) {
      console.error("Error fetching question details", error);
    } finally {
      setIsLoading(false);
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
    fetchQuestions(questionId);
    setMessage("");
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="question-details">
      <header className="mb-8">
        <h1>
          Question Details for {question && question.subjectName} (
          {question && question.subjectId})
        </h1>

        <button className="form-button" onClick={() => setEditModal(true)}>
          Edit Question
        </button>
        <button
          className="form-button ml-8"
          onClick={() => setDeleteModal(true)}
        >
          Delete Question
        </button>
      </header>

      {isLoading ? (
        <Loader />
      ) : (
        questionDetails.map((data) => (
          <div key={data.question_id}>
            <h2 className="text-4xl">Q: {data.questionText}</h2>
            <div className="flex items-center flex-col">
              <h2 className="border-b-2 pb-2">Options</h2>
              <ul className="flex flex-col gap-4 text-lg">
                {data.options.map((option, i) => (
                  <li key={i} className="flex gap-16">
                    <span>Option {i + 1}</span> -{" "}
                    <span className="font-semibold text-xl">{option}</span>
                  </li>
                ))}
                <span className="flex justify-between">
                  <span>Correct Answer</span>-
                  {data.correctOption !== null ? (
                    <span className="font-semibold text-xl">
                      Option {data.correctOption + 1}
                    </span>
                  ) : (
                    <span>No Correct Option available</span>
                  )}
                </span>
                <p className="flex justify-between">
                  <span>Marks</span> -{" "}
                  <span className="font-semibold text-xl">{data.marks}</span>{" "}
                </p>
              </ul>
            </div>
          </div>
        ))
      )}

      {editModal && (
        <div>
          <div className="modal-backdrop"></div>
          <QuestionEdit
            questionId={questionId}
            onClose={closeEditModal}
            onShowAlert={setShowAlert}
            message={message}
            onSetMessage={setMessage}
            onSetType={setType}
            question={question}
          />
        </div>
      )}

      {deleteModal && (
        <ConfirmDelete
          item="question"
          onCancel={() => setDeleteModal(false)}
          onDelete={() => handleDeleteQuestion(questionId)}
        />
      )}
      <Alert
        type={type}
        message={message}
        onClose={handleCloseAlert}
        isVisible={showAlert}
      />
    </div>
  );
}

export default QuestionDetails;
