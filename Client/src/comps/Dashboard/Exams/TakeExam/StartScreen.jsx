/* eslint-disable react/prop-types */
function StartScreen({ questions, numQuestions, dispatch }) {
  return (
    <div className="exam-start">
      <h2>
        Welcome to your {questions[0].subjectName} ({questions[0].subjectId})
        Exam
      </h2>
      <p>
        <span style={{ color: "lightblue" }}>{numQuestions}</span> questions are
        included in this Exam
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Begin Exam
      </button>
    </div>
  );
}

export default StartScreen;
