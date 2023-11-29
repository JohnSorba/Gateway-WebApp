import { useEffect, useState } from "react";
import axios from "axios";
import SubjectAdd from "./SubjectAdd";
import SubjectItem from "./SubjectItem";

const initialSubjectData = {
  classAssigned: "",
  subjectName: "",
  subjectCode: "",
};

function AdminTimetable() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState(null);
  const [addSubject, setAddSubject] = useState(false);

  const [timetable, setTimetable] = useState(null);
  const [subjectFormData, setSubjectFormData] = useState(initialSubjectData);

  // console.log(subjectFormData);

  // fetch classes
  useEffect(() => {
    // Code to run on component mount
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/auth/admission-classes"
        );
        const data = await response.data;
        // console.log(data);

        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes: ", error);
      }
    };

    fetchClasses();
  }, []);

  // fetch timetable and subjects
  useEffect(() => {
    if (selectedClass.length > 0) {
      getTimetable(selectedClass);
    }
  }, [selectedClass]);

  const getTimetable = async (selectedClass) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/timetable/${selectedClass}`
      );

      const TimetableData = await res.data.timetable;
      const subjectData = await res.data.subjects;
      // console.log("timetable: ", TimetableData);

      if (!TimetableData) {
        return;
      } else {
        setTimetable(TimetableData);
      }
      setSubjects(subjectData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  // Shuffle Timetable
  const handleShuffleClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/timetable/shuffleTimetable/${selectedClass}`
      );

      const data = response.data;
      console.log(data);

      setTimetable(data);
    } catch (error) {
      console.error("Error shuffling timetable", error);
    }
  };

  // Add Subject Modal
  const addSubjectModalOpen = () => {
    setAddSubject(!addSubject);
  };
  // Cancel Add Subject
  const addSubjectModalClose = () => {
    setAddSubject(!addSubject);
  };

  // Add subject Change
  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setSubjectFormData({ ...subjectFormData, [name]: value });
  };

  const handleSubjectAdd = () => {
    // Refresh the list after a subject is deleted
    getTimetable(selectedClass);

    setSubjectFormData({
      ...initialSubjectData,
      classAssigned: selectedClass,
    });
  };
  const handleSubjectDeleted = () => {
    // Refresh the list after a subject is deleted
    getTimetable(selectedClass);
  };
  const handleSubjectUpdate = () => {
    // Refresh the list after a subject is deleted
    getTimetable(selectedClass);
  };

  return (
    <div className="h-full">
      <div className="flex mb-8">
        <div className="flex flex-col w-3/6">
          <h3>Select Class</h3>

          {/* Select Classes from a dropdown list */}
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="form-select my-4"
          >
            <option value="" disabled>
              Select Class
            </option>
            {classes?.map((cls) => (
              <option key={cls.class_code} value={cls.class_code}>
                {cls.class_name}
              </option>
            ))}
          </select>

          {/* Subject List */}
          <div className="mb-8">
            {!subjects ? (
              <div>No Subject Selected</div>
            ) : (
              <SubjectItem
                subjects={subjects}
                onDelete={handleSubjectDeleted}
                onUpdate={handleSubjectUpdate}
              />
            )}
          </div>

          <button onClick={addSubjectModalOpen}>Add New Subject</button>

          {/* Conditional rendering of Subject Adding Form */}
          {addSubject && (
            <div className="modal-backdrop">
              <SubjectAdd
                subjectFormData={subjectFormData}
                onSubjectChange={handleSubjectChange}
                onSubjectAdd={handleSubjectAdd}
                onModalClose={addSubjectModalClose}
                classes={classes}
              />
            </div>
          )}
        </div>

        {/* Timetable with a grid of subjects and class schedule */}
        <div className="w-full">
          {!timetable ? (
            <h2 className="flex items-center justify-center">
              No Class Timetable Selected
            </h2>
          ) : (
            <div>
              <h2>Timetable for Class {selectedClass}</h2>
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

      <div>
        <button className="form-button" onClick={handleShuffleClick}>
          Shuffle Timetable
        </button>
      </div>
    </div>
  );
}

export default AdminTimetable;
