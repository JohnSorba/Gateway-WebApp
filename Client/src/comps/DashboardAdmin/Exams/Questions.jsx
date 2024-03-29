import axios from "axios";
import { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import Loader from "../../../Loader";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";
import { baseURL } from "../../Dashboard/DashboardData";
import { useSearch } from "../../../Contexts/SearchContext";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const { isLoading, setIsLoading } = useUser();
  const { searchQuery } = useSearch();

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, [setIsLoading]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${baseURL}/exams/get-questions`);

      const data = response.data;
      // console.log(data);

      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  const viewQuestionDetails = (id) => {
    navigate(`/dashboard/admin/questions/details/${id}`);
  };

  return (
    <div>
      <header className="header">
        <h2>Question Bank</h2>

        <div className="flex gap-4">
          <button>
            <Link to="/dashboard/admin/questions/add">Add Question</Link>
          </button>{" "}
        </div>
      </header>

      <div className="table-container h-[480px] overflow-y-scroll px-2">
        <table className="relative">
          <thead className="sticky top-0">
            <tr>
              <th className="w-[45px]">ID</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Question</th>
              <th>Class</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <Loader />
            ) : (
              questions
                .filter(
                  (item) =>
                    item.class_assigned
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.subject_name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.question_text
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((question, i) => (
                  <tr key={i} className="py-2 text-sm">
                    <td>{i + 1}</td>
                    <td>{question.subject_code}</td>
                    <td>{question.subject_name}</td>
                    <td className="font-semibold text-md">
                      {question.question_text}
                    </td>
                    <td>{question.class_assigned}</td>

                    <td className="flex justify-center">
                      <FaEye
                        className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer "
                        onClick={() =>
                          viewQuestionDetails(question.question_id)
                        }
                      />
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Questions;
