/* eslint-disable react/prop-types */
function FinishScreen({ marks, maxPossibleMarks, highscore, dispatch }) {
  const percent = (marks / maxPossibleMarks) * 100;

  let emoji;
  if (percent === 100) emoji = "🎖️";
  if (percent >= 80 && percent < 100) emoji = "😎";
  if (percent >= 50 && percent < 80) emoji = "🙂";
  if (percent >= 0 && percent < 50) emoji = "😐";
  if (percent === 0) emoji = "🤡";

  return (
    <>
      <div className="result">
        <span>{emoji}</span> You scored <strong>{marks}</strong> out of{" "}
        {maxPossibleMarks} ({Math.ceil(percent)}%)
      </div>
      <p className="highscore">(Highscore: {highscore} marks)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
