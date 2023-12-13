/* eslint-disable react/prop-types */
function Progress({
  index,
  numQuestions,
  marks,
  maxPossibleMarks,
  correctOption,
}) {
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={index + Number(correctOption !== null)}
      />

      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{marks}</strong> / {maxPossibleMarks}
      </p>
    </header>
  );
}

export default Progress;
