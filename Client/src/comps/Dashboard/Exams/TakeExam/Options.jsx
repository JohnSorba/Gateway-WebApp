/* eslint-disable react/prop-types */
function Options({ question, correctOption, dispatch }) {
  const hasAnswered = correctOption !== null;

  return (
    <div>
      <div className="options">
        {question.options.map((option, index) => (
          <button
            className={`btn btn-option ${
              index === correctOption ? "answer" : ""
            } ${
              hasAnswered
                ? index === question.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
            key={option}
            disabled={hasAnswered}
            onClick={() =>
              dispatch({ type: "newCorrectOption", payload: index })
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Options;
