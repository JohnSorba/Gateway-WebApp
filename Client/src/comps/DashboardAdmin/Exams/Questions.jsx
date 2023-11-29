import axios from "axios";
import { useState, useEffect } from "react";

const initialState = {
  subjectId: "",
  questionText: "",
  marks: "",
};

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState(initialState);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exams/get-questions`
      );

      const data = response.data;
      //   console.log(data);

      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/exams/add-question`,
        { newQuestions }
      );

      setMessage("Question added successfully!");
      console.log(response);
      console.log("New question added");

      setNewQuestions(initialState);

      fetchQuestions();
      //   setMessage(response.data);
    } catch (error) {
      console.error("Error adding question", error);
    }
  };

  const handleAddQuestionInput = (e) => {
    const { name, value } = e.target;
    setNewQuestions({ ...newQuestions, [name]: value });
  };

  return (
    <div>
      <div>
        <h2>Create a Question</h2>
        <div>
          {/* Subject Id input */}
          <article className="form-group">
            <label htmlFor="subjectId" className="form-label">
              Subject Id:
            </label>
            <input
              type="text"
              id="subjectId"
              name="subjectId"
              value={newQuestions.subjectId}
              onChange={handleAddQuestionInput}
              className="form-input"
            />
          </article>

          {/* Question Text input */}
          <article className="form-group">
            <label htmlFor="questionText" className="form-label">
              Question:
            </label>
            <input
              type="text"
              id="questionText"
              name="questionText"
              value={newQuestions.questionText}
              onChange={handleAddQuestionInput}
              className="form-input"
            />
          </article>

          {/* Marks Input */}
          <article className="form-group">
            <label htmlFor="marks" className="form-label">
              Marks:
            </label>
            <input
              type="number"
              id="marks"
              name="marks"
              value={newQuestions.marks}
              onChange={handleAddQuestionInput}
              className="form-input"
            />
          </article>

          <button onClick={handleAddQuestion} className="form-button">
            Add Question
          </button>
          <p>{message}</p>
        </div>
      </div>
      <div>
        <h2>Questions</h2>
        <ul>
          {questions.map((item, i) => (
            <li
              key={item.question_id}
              className=" grid grid-cols-[20px_1fr] gap-8"
            >
              {i + 1} <span>{item.question_text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Questions;
