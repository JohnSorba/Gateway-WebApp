import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ExamHome.css";

import { FaArrowRight } from "react-icons/fa";
import { PiQuestionBold, PiStudentFill } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import { FcViewDetails } from "react-icons/fc";
import { PiBooksFill } from "react-icons/pi";
import { baseURL } from "../../Dashboard/DashboardData";

function ExamHome() {
  const [examsCount, setExamsCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchExams();
    fetchQuestions();
    fetchSubjects();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(`${baseURL}/exams/get-total-exams`);

      const data = response.data;

      setExamsCount(data);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${baseURL}/exams/get-questions`);

      const data = response.data;

      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseURL}/exams/get-subjects`);
      const data = response.data;
      // console.log(data);

      setSubjects(data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  const examPageData = [
    {
      title: "Exam List",
      subtitle: "Total Exams",
      icon: <PiStudentFill />,
      value: examsCount,
      backgroundColor: "#6DB9EF",
      link: "/dashboard/admin/exams/exam-list",
    },
    {
      title: "Question List",
      subtitle: "Total Questions",
      icon: <PiQuestionBold />,
      value: questions.length,
      backgroundColor: "#DDD",
      link: "/dashboard/admin/questions",
    },
    {
      title: "Subject List",
      subtitle: "Total Subject",
      icon: <PiBooksFill />,
      value: subjects.length,
      backgroundColor: "#FF9999",
      link: "/dashboard/admin/timetable",
    },
    {
      title: "Exam Results",
      subtitle: "Total Results",
      icon: <TbReportAnalytics />,
      value: 5,
      backgroundColor: "#D0F288",
      link: "/dashboard/admin/exams",
    },
    {
      title: "Exam Instructions",
      subtitle: "Instructions",
      icon: <FcViewDetails />,
      value: 5,
      backgroundColor: "#F4F27E",
      link: "/dashboard/admin/exams",
    },
  ];

  return (
    <div>
      <header className="header">
        <h2 className="m-0">Exams Management</h2>
      </header>
      <div className="exams">
        {examPageData.map((item) => (
          <article
            key={item.title}
            className="box"
            style={{ backgroundColor: item.backgroundColor }}
          >
            <div>
              <div className="px-4 flex flex-col">
                <div className="flex gap-4 mb-2">
                  <span className="text-6xl">{item.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-sm">{item.subtitle}</span>
                    <span className="text-3xl font-semibold">{item.value}</span>
                  </div>
                </div>
                <span className="text-md font-semibold self-end">
                  {item.title}
                </span>
              </div>
            </div>
            <div
              className="flex mt-auto"
              style={{ backgroundColor: "#00000011" }}
            >
              <Link
                to={item.link}
                className="flex gap-2 py-1 items-center justify-center cursor-pointer w-full"
              >
                <span>More Info</span>
                <FaArrowRight className="w-3 h-3 " />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ExamHome;
