/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";

function QuestionEdit({
  questionId,
  question,
  onClose,
  message,
  onSetMessage,
  onShowAlert,
  onSetType,
}) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [marks, setMarks] = useState(0);
  const [correctOption, setCorrectOption] = useState(0);

  // console.log(question);
  // console.log(options);

  // Set initial value when the question prop changes
  useEffect(() => {
    setQuestionText(question.questionText || "");
    setOptions(question.options.length > 0 ? question.options : []);
    setMarks(question.marks);
    setCorrectOption(question.correctOption);
  }, [question]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
    onSetMessage("");
  };

  const handleEditQuestion = async () => {
    try {
      // Ensure questionText and options are not empty
      if (!questionText || options.some((option) => !option.trim())) {
        onSetMessage("Please fill in all fields");
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/exams/update-question/${questionId}`,
        {
          questionText,
          options,
          marks,
          correctOption,
        }
      );

      onClose();
      onSetMessage(response.data.message);
      onSetType(response.data.type);
      onShowAlert(true);
    } catch (error) {
      console.error("Error editing question", error);
    }
  };

  return (
    <div className="modal w-2/3 h-[650px] flex flex-col">
      <h2 className="font-semibold mb-8">Edit Question</h2>
      <article className="form-group">
        <label className="form-label">Question Text:</label>
        <textarea
          value={questionText}
          className="form-input"
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </article>

      {options.map((option, index) => (
        <article className="form-group mb-4" key={index}>
          <label className="form-label">{`Option ${index + 1}`}</label>
          <input
            type="text"
            value={option}
            className="form-input"
            placeholder={`Enter option ${index + 1}`}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        </article>
      ))}

      <div className="flex gap-8">
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
            value={marks}
            className="form-input"
            onChange={(e) => setMarks(e.target.value)}
          />
        </article>

        {/* Correct Option Input */}
        <article className="form-group">
          <label htmlFor="correctOption" className="form-label">
            Correct Answer:
          </label>
          <select
            id="correctOption"
            name="correctOption"
            value={correctOption}
            className="form-select"
            onChange={(e) => setCorrectOption(e.target.value)}
          >
            <option value={0}>Option 1</option>
            <option value={1}>Option 2</option>
            <option value={2}>Option 3</option>
            <option value={3}>Option 4</option>
          </select>
        </article>
      </div>

      <section className="flex justify-between items-center">
        <div>
          {message && (
            <p className="py-1 px-4 text-red-600 rounded-xl text-white">
              {message}
            </p>
          )}
        </div>
        <div className="flex gap-8">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleEditQuestion}>Save Changes</button>
        </div>
      </section>
    </div>
  );
}

export default QuestionEdit;
