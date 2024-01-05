/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./ExamHome.css";
import Alert from "../../Utilities/Alert";
import ConfirmDelete from "../../Utilities/ConfirmDelete";
import { baseURL, localDateString } from "../../Dashboard/DashboardData";
import { useUser } from "../../../Contexts/UserContext";
import Loader from "../../../Loader";

function ExamList() {
  const [examList, setExamList] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [newExamModal, setNewExamModal] = useState(false);
  const [dataView, setDataView] = useState("all");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { isLoading, setIsLoading } = useUser();
  const navigate = useNavigate();
  const [examDelete, setExamDelete] = useState({ open: false, examId: null });

  // fetch all exams for display
  useEffect(() => {
    fetchExams();
  }, [setIsLoading]);

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/exams/get-all-exams`);

      const examList = response.data;
      // console.log(examList);

      setExamList(examList);
    } catch (error) {
      console.error("Error fetching exams: ", error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  // FILTER EXAM LIST FOR DISPLAYING DIFFERENT VIEWS
  const draft = examList.filter((exam) => !exam.published);
  const pending = examList.filter(
    (exam) => exam.published && exam.status !== "completed"
  );
  const complete = examList.filter(
    (exam) => exam.published && exam.status === "completed"
  );

  console.log("draft: ", draft);
  console.log("pending: ", pending);
  console.log("complete: ", complete);

  // create exam
  const handleCreateExam = async () => {
    try {
      const response = await axios.post(`${baseURL}/exams/create-exam`, {
        examTitle,
      });

      setMessage(response.data.message);
      setType(response.data.type);
      setShowAlert(true);

      setNewExamModal(false);
      setExamTitle("");
      fetchExams();
    } catch (error) {
      console.error("Error creating exams: ", error.response.data.message);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleExamDeleteModal = (examId) => {
    setExamDelete({ open: true, examId: examId });
  };

  // Delete exam
  const handleDeleteExam = async (examId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/exams/delete-exam/${examId}`
      );

      console.log(response);

      fetchExams();
      setMessage(response.data);
      setShowAlert(true);
      setExamDelete({ open: false, examId: null });
    } catch (error) {
      console.error("Error deleting exam", error.response.data.message);
    }
  };

  const goToDraft = (draft) => {
    navigate(`draft/${draft}`);
  };

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
            <div>
              <button
                onClick={() => setNewExamModal(true)}
                className="btn-black font-semibold"
              >
                Create Exam
              </button>
            </div>
          </header>

          <div className="flex items-end justify-between mb-4 pb-4 border-b-2">
            <div>
              <select
                value={dataView}
                className="form-select"
                onChange={(e) => setDataView(e.target.value)}
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
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

                        ${!exam.published && "bg-red-500"}

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

                        {!exam.published && "Draft"}

                        {exam.published &&
                          exam.status !== "completed" &&
                          "In Progress"}
                      </p>
                    </div>

                    {/* Links to other pages */}
                    <div className="flex gap-3 items-end">
                      {!exam.published && (
                        <div className="flex gap-2 items-center">
                          <FaEdit
                            className="w-7 h-7 text-blue-600 icon"
                            onClick={() => goToDraft(exam.exam_id)}
                          />
                          <MdDeleteForever
                            className="w-6 h-6 text-red-600 icon"
                            onClick={() => handleExamDeleteModal(exam.exam_id)}
                          />
                        </div>
                      )}

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

            {/* Draft View */}
            {dataView === "draft" &&
              draft.map((exam) => (
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

                        ${!exam.published && "bg-red-500"}

                        ${
                          exam.published &&
                          exam.status !== "completed" &&
                          "bg-yellow-500"
                        }
                       }`}
                      ></div>
                      <p className="text-sm">{!exam.published && "Draft"}</p>
                    </div>

                    {/* Links to other pages */}
                    <div className="flex gap-3 items-end">
                      {!exam.published && (
                        <div className="flex gap-2 items-center">
                          <FaEdit
                            className="w-7 h-7 text-blue-600 icon"
                            onClick={() => goToDraft(exam.exam_id)}
                          />
                          <MdDeleteForever
                            className="w-6 h-6 text-red-600 icon"
                            onClick={() => handleExamDeleteModal(exam.exam_id)}
                          />
                        </div>
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

          {/* Modal for adding new exam */}
          {newExamModal && (
            <div>
              <div className="modal-backdrop"></div>
              <div className="modal">
                <h3 className="text-lg font-semibold mb-4">
                  Enter New Exam Details
                </h3>
                <article className="form-group">
                  <label className="form-label">Exam Title</label>
                  <input
                    type="text"
                    name="examId"
                    value={examTitle}
                    className="form-input"
                    onChange={(e) => setExamTitle(e.target.value)}
                  />
                </article>

                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    className="form-button"
                    onClick={() => setNewExamModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="form-button"
                    onClick={handleCreateExam}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          {examDelete.open && (
            <ConfirmDelete
              item="exam"
              onCancel={() => setExamDelete({ open: false, examId: null })}
              onDelete={() => handleDeleteExam(examDelete.examId)}
            />
          )}

          <Alert
            type={type}
            message={message}
            onClose={handleCloseAlert}
            isVisible={showAlert}
          />
        </div>
      )}
    </>
  );
}

export default ExamList;
