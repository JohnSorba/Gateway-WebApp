import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../../Loader";
import { useUser } from "../../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../Dashboard/DashboardData";

function AdminReports() {
  const [result, setResult] = useState([]);
  const { isLoading, setIsLoading } = useUser();

  const navigate = useNavigate();

  // console.log("results: ", result);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseURL}/admin/report/exam-result`);
        // console.log(response.data);

        setResult(response.data);
      } catch (error) {
        console.error("Error fetching student results: ", error.message);
      } finally {
        setIsLoading(false);
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
      <header className="header">
        <h2>Admin Reports</h2>
        <div></div>
      </header>

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
