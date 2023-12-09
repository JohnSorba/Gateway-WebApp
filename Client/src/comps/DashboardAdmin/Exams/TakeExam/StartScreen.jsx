/* eslint-disable react/prop-types */
function StartScreen({ questions, numQuestions, dispatch }) {
  return (
    <div>
      <div className="start">
        <h2>Welcome to the {questions[0].subjectId} Quiz</h2>
        <p>
          <span style={{ color: "lightblue" }}>{numQuestions}</span> questions
          to test your React mastery
        </p>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "start" })}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
