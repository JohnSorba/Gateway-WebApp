import axios from "axios";
import { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  // const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();

  // console.log(newQuestions);
  // console.log("q", questions);
  // console.log("sq", selectedQuestions);

  useEffect(() => {
    fetchSubjects();
    fetchClasses();

    fetchQuestions();

    fetchQuestionsBySubject(selectedSubject);
  }, [selectedSubject]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/admission-classes"
      );
      const data = await response.data;
      // console.log(data);

      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes: ", error);
    }
  };

  // fetch subjects by class
  useEffect(() => {
    if (selectedClass.length > 0) {
      getSubjectsByClass(selectedClass);
    }
  }, [selectedClass]);

  const getSubjectsByClass = async (selectedClass) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/timetable/${selectedClass}`
      );

      const subjectData = await res.data.subjects;
      // console.log("timetable: ", TimetableData);

      setSubjects(subjectData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exams/get-questions`
      );

      const data = response.data;
      // console.log(data);

      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exams/get-subjects`
      );

      const data = response.data;
      // console.log(data);

      setSubjects(data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  const fetchQuestionsBySubject = async (selectedSubject) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exams/get-questions/${selectedSubject}`
      );

      const data = response.data;
      // console.log(data);

      setSelectedQuestions(data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  // const handleViewAllQuestions = () => {
  //   setSelectAll(true);
  //   fetchQuestions();
  // };

  const viewQuestionDetails = (id) => {
    navigate(`/dashboard/admin/questions/details/${id}`);
  };

  return (
    <div>
      <header>
        <h2>Welcome to the Question Bank</h2>

        <div className="flex gap-4">
          <Link to="/dashboard/admin/questions/add">
            <button className="form-button">Add Question</button>
          </Link>
          <button
            className="form-button"
            // onClick={handleViewAllQuestions}
          >
            View All Quesitons
          </button>
        </div>

        <ul>
          <h3 className="text-lg mt-4">To Do</h3>
          <li>filter questions by class, subject, marks, name</li>
        </ul>

        {/* Select Classes from a dropdown list */}
        <div className="flex gap-4 items-center">
          <article>
            <label className="form-label">Class Name</label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="form-select mt-1 mb-4"
            >
              <option value="" disabled>
                Select Class
              </option>
              <option value={questions}>Select All</option>
              {classes?.map((cls) => (
                <option key={cls.class_code} value={cls.class_code}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </article>

          {/* Select subjects from dropdown */}
          {selectedClass && (
            <article className="form-group">
              <label className="form-label">Subject Name</label>
              <select
                name="selectedSubject"
                value={selectedSubject}
                className="form-select"
                onChange={handleSubjectChange}
              >
                <option value="" disabled>
                  Select Subject
                </option>
                {subjects.map((subject) => (
                  <option
                    key={subject.subject_code}
                    value={subject.subject_code}
                  >
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </article>
          )}
        </div>
      </header>

      <div>
        <h2>Questions</h2>

        <table>
          <thead>
            <tr>
              <th className="w-[75px]">ID</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Question</th>
              <th>Mark</th>
              <th>Class</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedQuestions.length < 1
              ? questions.map((question, i) => (
                  <tr key={i} className="py-2 text-sm">
                    <td>{i + 1}</td>
                    <td>{question.subject_code}</td>
                    <td>{question.subject_name}</td>
                    <td className="font-semibold text-md">
                      {question.question_text}
                    </td>
                    <td>{question.marks}</td>
                    <td>{question.class_assigned}</td>

                    <button
                      className="flex gap-2 items-center py-2"
                      onClick={() => viewQuestionDetails(question.question_id)}
                    >
                      <span>View Details</span> <FaEye />
                    </button>
                  </tr>
                ))
              : selectedQuestions.map((question, i) => (
                  <tr key={i} className="py-2 text-sm">
                    <td>{question.question_id}</td>
                    <td>{question.subject_code}</td>
                    <td>{question.subject_name}</td>
                    <td className="font-semibold text-md">
                      {question.question_text}
                    </td>
                    <td>{question.marks}</td>
                    <td>{question.class_assigned}</td>

                    <button
                      className="flex gap-2 items-center py-2"
                      onClick={() => viewQuestionDetails(question.question_id)}
                    >
                      <span>View Details</span> <FaEye />
                    </button>
                  </tr>
                ))}

            {/* {selectAll && questions.map((question, i) => {
                <tr key={i} className="py-2 text-sm">
                <td>{question.question_id}</td>
                <td>{question.subject_code}</td>
                <td>{question.subject_name}</td>
                <td className="font-semibold text-md">
                  {question.question_text}
                </td>
                <td>{question.marks}</td>
                <td>{question.class_assigned}</td>
                <Link
                  to={`/dashboard/admin/questions/details/${question.question_id}`}
                >
                  <button className="flex gap-2 items-center py-2">
                    <span>View Details</span> <FaEye />
                  </button>
                </Link>
              </tr>
              }} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Questions;
