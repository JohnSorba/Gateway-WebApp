import axios from "axios";
import { useState } from "react";

const initialState = {
  subjectId: "",
  questionText: "",
  marks: 5,
  correctOption: 0,
};

function QuestionsAdd() {
  const [newQuestions, setNewQuestions] = useState(initialState);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");

  const handleAddQuestion = async () => {
    try {
      // Ensure questionText and options are not empty
      if (
        !newQuestions.questionText ||
        options.some((option) => !option.trim())
      ) {
        setMessage("Please fill in all fields");
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/exams/add-question`,
        { newQuestions, options }
      );

      setMessage("Question added successfully!");
      console.log(response);
      console.log(response.data);

      setNewQuestions(initialState);
      setOptions(["", "", "", ""]);

      //   fetchQuestions();
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
    <div className="w-[800px] mx-auto">
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

        {/* Marks Input */}
        <article className="form-group">
          <label htmlFor="marks" className="form-label">
            Marks:
          </label>
          <input
            type="number"
            min="5"
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
            Correct Answer:
          </label>
          <input
            type="number"
            min="0"
            max="3"
            id="correctOption"
            name="correctOption"
            value={newQuestions.correctOption}
            className="form-input"
            onChange={handleAddQuestionInput}
          />
        </article>

        <button onClick={handleAddQuestion} className="form-button">
          Add Question
        </button>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default QuestionsAdd;
