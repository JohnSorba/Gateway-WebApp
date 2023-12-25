import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../../Contexts/UserContext";

function TeacherTimetable() {
  const [timetable, setTimetable] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const { userDetails } = useUser();
  console.log(userDetails);

  useEffect(() => {
    const getTimetable = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/timetable/${userDetails.class_code}`
        );

        const TimetableData = await res.data.timetable;
        const subjectData = await res.data.subjects;

        if (!TimetableData) {
          return;
        } else {
          setTimetable(TimetableData);
          setSubjects(subjectData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getTimetable();
  }, [userDetails.class_code]);

  return (
    <div className="grid grid-cols-[350px_1fr] gap-8">
      <ul className="flex flex-col gap-1">
        <h2> Subjects offered in class {userDetails.class_code}</h2>
        <li className="grid grid-cols-[30px_100px_1fr] gap-3 font-semibold mb-2">
          <span>No.</span>
          <p>Code</p>
          <p>Subject Name</p>
        </li>

        {/* Edit subject, Otherwise display subjects */}
        {subjects?.map((subject, index) => (
          <li
            key={subject.subject_code}
            className="grid grid-cols-[30px_100px_1fr] gap-3 items-center border-b-2 pb-1"
          >
            <span className="font-semibold">{index + 1}</span>
            <p className="text-[13px] font-semibold">{subject.subject_code}</p>
            <p>{subject.subject_name}</p>
          </li>
        ))}
      </ul>
      {/* Timetable with a grid of subjects and class schedule */}
      <div className="w-full">
        {!timetable ? (
          <h2 className="flex items-center justify-center">
            No Class Timetable Selected
          </h2>
        ) : (
          <div>
            <h2>Timetable for Class {userDetails.class_code}</h2>
            <table className="w-[750px] mx-auto">
              <thead>
                <tr className="text-sm text-center">
                  <th className="w-[80px]">Day</th>
                  <th>Period 1 (08:30)</th>
                  <th>Period 2 (09:30)</th>
                  <th>Break (09:30)</th>
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
                      <td key={index} className="text-sm text-center">
                        {period?.id} <br />
                        {period?.subject_name} <br />
                        {period?.subject_code} <br />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherTimetable;
