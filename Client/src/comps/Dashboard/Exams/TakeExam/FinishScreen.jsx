import axios from "axios";
import { useUser } from "../../../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
function FinishScreen({
  marks,
  maxPossibleMarks,
  highscore,
  // dispatch,
  examId,
  subjectId,
}) {
  const percent = (marks / maxPossibleMarks) * 100;
  const marksObtained = Math.ceil(percent);
  const { userDetails } = useUser();

  const navigate = useNavigate();

  const studentId = userDetails.student_id;
  console.log(studentId);

  let emoji;
  if (percent === 100) emoji = "🎖️";
  if (percent >= 80 && percent < 100) emoji = "😎";
  if (percent >= 50 && percent < 80) emoji = "🙂";
  if (percent >= 0 && percent < 50) emoji = "😐";
  if (percent === 0) emoji = "🤡";

  const handleExamCompletion = async (examId, subjectId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/exams/submit-grades/${examId}/${subjectId}`,
        { studentId, marksObtained, isComplete: true }
      );
      console.log(response.data.message);

      navigate(`/dashboard/student/exams/exam-details/${examId}`);
    } catch (error) {
      console.error("Error submitting grades: ", error);
    }
  };

  return (
    <>
      <div className="result">
        <span>{emoji}</span> You scored <strong>{marks}</strong> out of{" "}
        {maxPossibleMarks} ({Math.ceil(percent)}%)
      </div>
      <p className="highscore">(Highscore: {highscore} marks)</p>
      <button
        className="btn btn-ui"
        onClick={() => handleExamCompletion(examId, subjectId)}
      >
        Go To Exams
      </button>
    </>
  );
}

export default FinishScreen;
