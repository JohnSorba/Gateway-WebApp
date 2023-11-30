import axios from "axios";
import { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

function Questions() {
  const [questions, setQuestions] = useState([]);

  // console.log(newQuestions);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exams/api/questions`
      );

      const data = response.data;
      // console.log(data);

      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  return (
    <div>
      <header>
        <h2>Welcome to the Question Bank</h2>

        <div className="flex gap-4">
          <Link to="/dashboard/admin/questions/add">
            <button className="form-button">Add Question</button>
          </Link>
          <button className="form-button">View All Quesitons</button>
        </div>

        <h3 className="text-lg mt-4">To Do</h3>
        <ul>
          <li>select questions by class</li>
          <li>select questions by subject</li>
          <li>only display questions</li>
          <li>add edit button for each question</li>
          <li>add view details button for each question</li>
          <li>add a checkbox for multiple selection</li>
        </ul>
      </header>

      <div>
        <h2>Questions</h2>
        <ul>
          {questions.map((question, i) => (
            <li
              key={question.question_id}
              className=" grid grid-cols-[20px_1fr] gap-8 items-start mb-4"
            >
              <span>{i + 1}</span>{" "}
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold">{question.questionText}</p>
                <button className="flex gap-2 items-center form-button">
                  <span>View Details</span> <FaEye />
                </button>
                {/* {question.options.map((option) => (
                  <p key={option}>{option}</p>
                ))} */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Questions;
