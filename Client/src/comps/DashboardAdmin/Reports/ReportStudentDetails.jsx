import { useParams } from "react-router-dom";
import Loader from "../../../Loader";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUser } from "../../../Contexts/UserContext";
import { baseURL, localDateString } from "../../Dashboard/DashboardData";
// import ReactPdfPrint from "../../Utilities/ReactPdfPrint";
import { useReactToPrint } from "react-to-print";

function ReportStudentDetails() {
  const [result, setResult] = useState([]);
  // const [query, setQuery] = useState("");
  const { isLoading, setIsLoading } = useUser();

  const { examId, studentId } = useParams();
  const examDetails = result[0];

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseURL}/admin/report/student-result/${examId}/${studentId}`
        );

        setResult(response.data);
      } catch (error) {
        console.error("Error fetching student results: ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [examId, studentId, setIsLoading]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${examDetails?.first_name}_${examDetails?.last_name}_final_report`,
  });

  // const marginTop = "10px";
  // const marginRight = "5px";
  // const marginBottom = "10px";
  // const marginLeft = "5px";

  return (
    <>
      <div id="details">
        <header className="header">
          <h2>
            {examDetails?.first_name} {examDetails?.last_name}&apos;s Report
            Details
          </h2>
          <button onClick={handlePrint}>Print Report</button>
        </header>

        {/* <ReactPdfPrint /> */}

        <section
          ref={componentRef}
          style={{
            width: "80%",
            height: window.innerHeight,
            margin: "2rem auto auto",
          }}
          className="print-section flex flex-col items-center"
        >
          <header
            style={{
              margin: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              textAlign: "center",
            }}
          >
            <img src="/gateway_logo_final.png" alt="logo" />{" "}
            <h1>
              {examDetails?.first_name} {examDetails?.last_name} Exam Report
            </h1>
          </header>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "spaceBetween",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                columnGap: "2rem",
                marginBottom: "2rem",
                width: "100%",
              }}
              className="grid grid-cols-3 gap-16"
            >
              <article
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                }}
              >
                <p>
                  <span style={{ fontWeight: "bold" }}>Exam Name</span>:{" "}
                  <span>{examDetails?.title}</span>
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Exam Date: </span>
                  <span>{localDateString(examDetails?.date_created)}</span>
                </p>
              </article>
              <article
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                }}
              >
                <p>
                  <span style={{ fontWeight: "bold" }}>Full Name: </span>
                  <span>
                    {examDetails?.first_name} {examDetails?.last_name}
                  </span>
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Age: </span>
                  <span>{examDetails?.age}</span>
                </p>
              </article>
              <article
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                }}
              >
                <p>
                  <span style={{ fontWeight: "bold" }}>Student ID: </span>
                  <span>{examDetails?.student_id}</span>
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Class: </span>
                  <span>{examDetails?.class_assigned}</span>
                </p>
              </article>
            </div>
          </div>
          {/* <input
            type="search"
            placeholder="Filter by ID, name, subject..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input mb-4 w-[300px]"
          /> */}
          <table className="mb-16" id="table">
            <thead>
              <tr>
                <th>###</th>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Marks</th>
                <th>Remarks</th>
              </tr>
            </thead>
            {isLoading ? (
              <Loader />
            ) : (
              <tbody>
                {result.length < 1 ? (
                  <tr>
                    <td>
                      There are no available results that match your query.
                    </td>
                  </tr>
                ) : (
                  result.map((data, i) => (
                    <tr key={i}>
                      <td>00{i + 1}</td>
                      <td>{data.subject_code}</td>
                      <td>{data.subject_name}</td>
                      <td>{data.marks_obtained}</td>
                      <td>
                        <span
                          className={`${
                            data.marks_obtained >= 50 ? "pass" : "fail"
                          }`}
                        >
                          {data.marks_obtained >= 50 ? "Pass" : "Fail"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
        </section>
      </div>
    </>
  );
}

export default ReportStudentDetails;
