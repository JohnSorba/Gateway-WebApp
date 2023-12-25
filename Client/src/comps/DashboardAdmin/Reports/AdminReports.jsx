import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../../Loader";
import { useUser } from "../../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

function AdminReports() {
  const [result, setResult] = useState([]);
  const { isLoading } = useUser();

  const navigate = useNavigate();

  // console.log("results: ", result);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/exams/exam-result`
        );

        // console.log(response.data);

        setResult(response.data);
      } catch (error) {
        console.error("Error fetching student results: ", error.message);
      }
    };

    fetchResults();
  }, []);

  // if (!result) {
  //   return <Loader />;
  // }

  const handleViewExamReportDetails = (param) => {
    navigate(`exam-details/${param}`);
  };
  return (
    <div>
      <h1>Admin Reports</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="exams">
          {result.map((data, i) => (
            <div key={i} className="box">
              <p>{data.title}</p>
              <button onClick={() => handleViewExamReportDetails(data.exam_id)}>
                Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReports;
