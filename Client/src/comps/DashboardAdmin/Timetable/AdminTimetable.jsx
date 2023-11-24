import { useEffect, useState } from "react";
import axios from "axios";

const timetable = {
  times: ["8:00-8:30", "8:30-9:15", "9:15-10:00", "10:00-10:15", "10:15-11:00"],
  schedule: {
    Monday: ["Morning Assembly", "Mathematics", "Reading", "Break", "Science"],
    Tuesday: [
      "Morning Assembly",
      "Geography",
      "Art",
      "Break",
      "Physical Education",
    ],
    Wednesday: ["Morning Assembly", "History", "Music", "Break", "Mathematics"],
    Thursday: ["Morning Assembly", "Science", "Reading", "Break", "Art"],
    Friday: [
      "Morning Assembly",
      "Physical Education",
      "Music",
      "Break",
      "Geography",
    ],
  },
};

console.log(timetable);

function AdminTimetable() {
  // const [subjects, setSubjects] = useState(null);
  const [timetable, setTimetable] = useState(null);

  useEffect(() => {
    // Code to run on component mount
    const getSubjects = async () => {
      try {
        // const response = await axios.get(
        //   `http://localhost:3000/timetable/${101}`
        // );

        // const data = await response.data.subjects;
        // console.log(data);

        // setSubjects(data);

        const res = await axios.get(`http://localhost:3000/timetable/${102}`);
        console.log("timetable response: ", res);

        const TimetableData = await res.data.timetable;
        console.log("timetable: ", TimetableData);

        setTimetable(TimetableData);
      } catch (error) {
        console.error("Error fetching subjects: ", error);
      }
    };

    getSubjects();
  }, []);
  return (
    <div>
      <h2>Timetable for Class 3</h2>

      {/* <table className="w-[1200px] mx-auto">
        <thead>
          <tr>
            <th>Time/Day</th>
            {Object.keys(timetable?.schedule).map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timetable.times.map((time, index) => (
            <tr key={time}>
              <td>{time}</td>
              {Object.keys(timetable.schedule).map((day) => (
                <td key={day}>{timetable.schedule[day][index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}

      {!timetable ? (
        <div>Loading...</div>
      ) : (
        <table className="w-[1000px] mx-auto">
          <thead>
            <tr className="text-sm text-center">
              <th className="w-[80px]">Day</th>
              <th>Period 1 (08:30)</th>
              <th>Period 2 (09:30)</th>
              <th>Period 3 (10:30)</th>
              <th>Period 4 (11:30)</th>
            </tr>
          </thead>
          <tbody>
            {timetable?.map((day) => (
              <tr key={day.day}>
                <td className="font-semibold text-sm bg-slate-100 ">
                  <p className="-rotate-45">{day.day}</p>
                </td>
                {day.periods.map((period, index) => (
                  <td key={index} className="text-sm">
                    subject id: {period.id} <br />
                    {period.subject_name} <br />
                    Code: {period.subject_code} <br />
                    Teacher: Mr. Lambert
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* {!subjects ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {subjects?.map((subject, index) => (
            <li key={subject.subject_code} className="flex gap-4">
              <span>{index + 1}</span>
              <p>{subject.subject_code}</p> {"-"}
              <p>{subject.subject_name}</p>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}

export default AdminTimetable;
