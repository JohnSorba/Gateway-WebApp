import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function ExamDetails() {
  const { examId } = useParams();
  const [examDetails, setExamDetails] = useState(null);

  console.log(setExamDetails);

  return (
    <div>
      <h2>Exam Details</h2>
      {examDetails && (
        <div>
          <h3>{examDetails.title}</h3>
          {/* Display other details */}

          <Link to={`/dashboard/admin/exams/exam-subjects/${examId}`}>
            Go to Exam Subject
          </Link>
        </div>
      )}
    </div>
  );
}

export default ExamDetails;
