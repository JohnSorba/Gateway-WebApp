import axios from "axios";
import { useEffect, useState } from "react";
import Alert from "../../Utilities/Alert";
import { baseURL } from "../../Dashboard/DashboardData";

const initialState = {
  subjectId: "",
  questionText: "",
  marks: 0,
  correctOption: "",
};

function QuestionsAdd() {
  const [newQuestions, setNewQuestions] = useState(initialState);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [options, setOptions] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");

  const [warning, setWarning] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    fetchClasses();

    if (selectedClass.length > 0) {
      fetchSubjects();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseURL}/exams/add-question/classes`);

      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/exams/add-question/subjects/${selectedClass}`
      );

      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects", error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      // Ensure questionText and options are not empty
      if (
        !newQuestions.questionText ||
        !newQuestions.correctOption ||
        !newQuestions.marks ||
        options.some((option) => !option.trim())
      ) {
        setWarning("Please fill in all fields");
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/exams/add-question`,
        { newQuestions, options }
      );

      setMessage(response.data.message);
      setType(response.data.type);
      setShowAlert(true);
      setWarning("");

      setNewQuestions(initialState);
      setOptions(["", "", "", ""]);
    } catch (error) {
      console.error("Error adding question", error);
    }
  };

  const handleAddQuestionInput = (e) => {
    const { name, value } = e.target;
    setNewQuestions({ ...newQuestions, [name]: value });
    setMessage("");
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="w-[800px] mx-auto py-8">
      <header className="text-center mb-8">
        <h2 className="mb-2">Add a New Question</h2>
        <p className="text-red-500">
          Please select a class and a subject before filling in the question
          details.
        </p>
      </header>
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Class input */}
          <article className="form-group">
            <label htmlFor="subjectId" className="form-label">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-select"
            >
              <option value="" disabled>
                Select Class
              </option>
              {classes.map((cls) => (
                <option key={cls.class_code} value={cls.class_code}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </article>

          {/* Subject ID input */}
          <article className="form-group">
            <label htmlFor="subjectId" className="form-label">
              Select Subject
            </label>
            <select
              name="subjectId"
              value={newQuestions.subjectId}
              onChange={handleAddQuestionInput}
              className="form-select"
            >
              <option value="" disabled>
                Select Subject
              </option>
              {subjects.map((subject) => (
                <option key={subject.subject_code} value={subject.subject_code}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </article>
        </div>

        {/* Question Text input */}
        <article className="form-group">
          <label htmlFor="questionText" className="form-label">
            Question Text:
          </label>
          <textarea
            id="questionText"
            name="questionText"
            value={newQuestions.questionText}
            placeholder="Enter Question..."
            onChange={handleAddQuestionInput}
            className="form-input"
          />
        </article>

        {/* Options Input */}
        {options.map((option, index) => (
          <article className="form-group" key={index}>
            <label htmlFor="options" className="form-label">
              Option {index + 1}:
            </label>
            <input
              type="text"
              value={option}
              className="form-input"
              placeholder={`Enter option ${index + 1}`}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
            />
          </article>
        ))}

        <div className="flex gap-8">
          {/* Marks Input */}
          <article className="form-group">
            <label htmlFor="marks" className="form-label">
              Enter Marks:
            </label>
            <input
              type="number"
              min="0"
              max="20"
              id="marks"
              name="marks"
              value={newQuestions.marks}
              className="form-input"
              onChange={handleAddQuestionInput}
            />
          </article>

          {/* Correct Option Input */}
          <article className="form-group">
            <label htmlFor="correctOption" className="form-label">
              Choose Correct Answer:
            </label>
            <select
              id="correctOption"
              name="correctOption"
              value={newQuestions.correctOption}
              className="form-select"
              onChange={handleAddQuestionInput}
            >
              <option value="" disabled>
                Choose Option
              </option>
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
          </article>
        </div>
      </div>

      {/* FOOTER  */}
      <footer className="flex justify-between items-start">
        <div>
          {warning && (
            <p className="text-white bg-red-500 py-1 px-3 rounded-xl">
              {warning}
            </p>
          )}
        </div>
        <button onClick={handleAddQuestion} className="form-button">
          Add Question
        </button>
      </footer>

      <Alert
        type={type}
        message={message}
        onClose={handleCloseAlert}
        isVisible={showAlert}
      />
    </div>
  );
}

export default QuestionsAdd;
