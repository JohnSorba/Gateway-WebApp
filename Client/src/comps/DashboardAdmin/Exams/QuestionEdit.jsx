/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";

function QuestionEdit({
  questionId,
  question,
  onClose,
  onSetMessage,
  onShowAlert,
}) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);

  // Set initial value when the question prop changes
  useEffect(() => {
    setQuestionText(question.questionText || "");
    setOptions(question.options.length > 0 ? question.options : []);
  }, [question]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
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
        }
      );

      onClose();
      onSetMessage(response.data);
      onShowAlert(true);
    } catch (error) {
      console.error("Error editing question", error);
    }
  };

  return (
    <div className="modal w-2/3 flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Edit Question: </h3>
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

      <div className="flex gap-8 self-end">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleEditQuestion}>Save Changes</button>
      </div>
    </div>
  );
}

export default QuestionEdit;
