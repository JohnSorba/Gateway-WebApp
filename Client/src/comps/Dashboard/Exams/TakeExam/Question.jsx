/* eslint-disable react/prop-types */
import Options from "./Options";

function Question({ question, dispatch, correctOption }) {
  return (
    <div>
      <h4>{question.questionText}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        correctOption={correctOption}
      />
    </div>
  );
}

export default Question;
