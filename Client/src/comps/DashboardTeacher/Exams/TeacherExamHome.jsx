/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../DashboardAdmin/Exams/ExamHome.css";
import { baseURL, localDateString } from "../../Dashboard/DashboardData";
import { useUser } from "../../../Contexts/UserContext";
import Loader from "../../../Loader";

function TeacherExamHome() {
  const [examList, setExamList] = useState([]);
  const [dataView, setDataView] = useState("all");
  const { isLoading, setIsLoading, userDetails } = useUser();
  const navigate = useNavigate();

  const classId = userDetails?.class_code;

  // fetch all exams for display
  useEffect(() => {
    fetchExams();
  }, [setIsLoading]);

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/teacher/exams/get-all-exams/${classId}`
      );

      const examList = response.data;
      //   console.log(examList);

      setExamList(examList);
    } catch (error) {
      console.error("Error fetching exams: ", error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  // FILTER EXAM LIST FOR DISPLAYING DIFFERENT VIEWS
  const pending = examList.filter(
    (exam) => exam.published && exam.status !== "completed"
  );
  const complete = examList.filter(
    (exam) => exam.published && exam.status === "completed"
  );

  const goToOngoing = (ongoing) => {
    navigate(`ongoing/${ongoing}`);
  };

  const goToCompleted = (completed) => {
    navigate(`completed/${completed}`);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="pb-16">
          <header className="header">
            <h2 className="m-0">Exam List</h2>
            <div></div>
          </header>

          <div className="flex items-end justify-between mb-4 pb-4 border-b-2">
            <div className="flex gap-4 items-end">
              <p className="text-lg">Filter: </p>
              <select
                value={dataView}
                className="form-select"
                onChange={(e) => setDataView(e.target.value)}
              >
                <option value="all">All</option>
                <option value="ongoing">Ongoing</option>
                <option value="complete">Completed</option>
              </select>
            </div>

            <div></div>
          </div>
          {/* Display exams fetched from API */}
          <ul className="exam-list">
            {dataView === "all" &&
              examList.map((exam) => (
                <li key={exam.exam_id} className={`exam-item`}>
                  <header>
                    <div>
                      <h3>
                        {exam.title}{" "}
                        <span className="text-sm">({exam.exam_id})</span>
                      </h3>
                    </div>

                    <div>
                      <span className="text-sm font-semibold">
                        Created: {localDateString(exam.date_created)}
                      </span>
                    </div>
                  </header>

                  <div className="flex justify-between items-center gap-3 mt-auto">
                    {/* Color Indicator for progress */}
                    <div className="flex items-center gap-1 justify-end">
                      <div
                        className={`status w-2 h-2 rounded-full 
                       ${
                         exam.published &&
                         exam.status === "completed" &&
                         "bg-green-500"
                       }

                        

                        ${
                          exam.published &&
                          exam.status !== "completed" &&
                          "bg-yellow-500"
                        }
                       }`}
                      ></div>
                      <p className="text-sm">
                        {exam.published &&
                          exam.status === "completed" &&
                          "Completed"}

                        {exam.published &&
                          exam.status !== "completed" &&
                          "In Progress"}
                      </p>
                    </div>

                    {/* Links to other pages */}
                    <div className="flex gap-3 items-end">
                      {exam.published && exam.status !== "completed" && (
                        <FaEye
                          className="w-7 h-7 text-green-600 icon"
                          onClick={() => goToOngoing(exam.exam_id)}
                        />
                      )}
                      {exam.published && exam.status == "completed" && (
                        <FaEye
                          className="w-7 h-7 text-green-600 icon"
                          onClick={() => goToCompleted(exam.exam_id)}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}

            {/* Pending View */}
            {dataView === "ongoing" &&
              pending.map((exam) => (
                <li key={exam.exam_id} className={`exam-item`}>
                  <header>
                    <div>
                      <h3>
                        {exam.title} ({exam.exam_id})
                      </h3>
                    </div>

                    <div>
                      <span className="text-sm font-semibold">
                        Created: {localDateString(exam.date_created)}
                      </span>
                    </div>
                  </header>

                  <div className="flex justify-between items-center gap-3 mt-auto">
                    {/* Color Indicator for progress */}
                    <div className="flex items-center gap-1 justify-end">
                      <div
                        className={`status w-2 h-2 rounded-full 
                        ${
                          exam.published &&
                          exam.status !== "completed" &&
                          "bg-yellow-500"
                        }
                       }`}
                      ></div>
                      <p className="text-sm">
                        {exam.published &&
                          exam.status !== "completed" &&
                          "In Progress"}
                      </p>
                    </div>

                    {/* Links to other pages */}
                    <div className="flex gap-3 items-end">
                      {exam.published && exam.status !== "completed" && (
                        <FaEye
                          className="w-5 h-5 text-green-600 icon"
                          onClick={() => goToOngoing(exam.exam_id)}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}

            {/* Completed View */}
            {dataView === "complete" &&
              complete.map((exam) => (
                <li key={exam.exam_id} className={`exam-item`}>
                  <header>
                    <div>
                      <h3>
                        {exam.title} ({exam.exam_id})
                      </h3>
                    </div>

                    <div>
                      <span className="text-sm font-semibold">
                        Created: {localDateString(exam.date_created)}
                      </span>
                    </div>
                  </header>

                  <div className="flex justify-between items-center gap-3 mt-auto">
                    {/* Color Indicator for progress */}
                    <div className="flex items-center gap-1 justify-end">
                      <div
                        className={`status w-2 h-2 rounded-full 
                       ${
                         exam.published &&
                         exam.status === "completed" &&
                         "bg-green-500"
                       }                      
                       }`}
                      ></div>
                      <p className="text-sm">
                        {exam.published &&
                          exam.status === "completed" &&
                          "Completed"}
                      </p>
                    </div>

                    {/* Links to other pages */}
                    <div className="flex gap-3 items-end">
                      {exam.published && exam.status == "completed" && (
                        <FaEye
                          className="w-5 h-5 text-green-600 icon"
                          onClick={() => goToCompleted(exam.exam_id)}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default TeacherExamHome;
