import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";

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
  const [message, setMessage] = useState("");

  const [timetable, setTimetable] = useState(null);
  const [subjectFormData, setSubjectFormData] = useState(initialSubjectData);

  // console.log(subjectFormData);

  // console.log(classes);
  const className = classes[5]?.class_name;
  // console.log(selectedClass);

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
    getTimetable(selectedClass);
  }, [selectedClass]);

  const getTimetable = async (selectedClass) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/timetable/${selectedClass}`
      );

      const TimetableData = await res.data.timetable;
      const subjectData = await res.data.subjects;
      // console.log("timetable: ", TimetableData);

      // console.log("subjects: ", subjectData);

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

  // Add Subject Toggle
  const handleAddSubject = () => {
    setAddSubject(!addSubject);
  };

  // Add subject Change
  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setSubjectFormData({ ...subjectFormData, [name]: value });
  };

  // Submit Added subject
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/timetable/addSubject`,
        subjectFormData
      );

      const message = response.data.message;

      if (message) {
        setMessage(message);
        getTimetable(selectedClass);
        setSubjectFormData({
          ...initialSubjectData,
          classAssigned: selectedClass,
        });
      }

      console.log(message);
    } catch (error) {
      console.error("Error adding subject", error);
      setMessage(error.response.data.error);
    }
  };

  // handle Delete
  const handleDelete = async (subjectId) => {
    try {
      await axios.delete(
        `http://localhost:3000/timetable/subjects/${subjectId}`
      );
      getTimetable(selectedClass);
    } catch (error) {
      console.error("Error deleting subject: ", error);
    }
  };

  return (
    <div className="h-full">
      <div className="flex mb-8">
        <div className="flex flex-col w-3/6">
          <h3>Select Class</h3>

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

          <div className="mb-8">
            {!subjects ? (
              <div>No Subject Selected</div>
            ) : (
              <>
                <h3 className="mb-4 text-lg">
                  Total Subjects: {subjects.length}
                </h3>
                <ul className="flex flex-col gap-1">
                  <li className="grid grid-cols-[30px_80px_1fr] gap-3 font-semibold mb-2">
                    <span>No.</span>
                    <p>Code</p>
                    <p>Subject Name</p>
                  </li>
                  {subjects?.map((subject, index) => (
                    <li
                      key={subject.subject_code}
                      className="grid grid-cols-[30px_100px_1fr_25px_25px] gap-3 items-center border-b-2 pb-1"
                    >
                      <span className="font-semibold">{index + 1}</span>
                      <p className="text-[13px] font-semibold">
                        {subject.subject_code}
                      </p>
                      <p>{subject.subject_name}</p>
                      <FaEdit className="h-5 w-5 text-blue-400 cursor-pointer" />
                      <MdDeleteForever
                        className="h-5 w-5 text-red-500 cursor-pointer hover:bg-red-50"
                        onClick={() => handleDelete(subject.id)}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <>
            <button onClick={handleAddSubject}>
              {addSubject === false ? (
                <span>Add New Subject</span>
              ) : (
                <span>Close</span>
              )}
            </button>
            {addSubject && (
              <div>
                <h3 className="text-lg mt-8 mb-4">Add Subject</h3>
                <form>
                  <article className="form-group">
                    <label htmlFor="classAssigned" className="form-label">
                      Class Assigned
                    </label>
                    <select
                      id="classAssigned"
                      name="classAssigned"
                      value={subjectFormData.classCode}
                      className="form-select"
                      onChange={handleSubjectChange}
                    >
                      <option value="Select Class" disabled>
                        Select Class
                      </option>
                      {classes?.map((cls) => (
                        <option key={cls.class_code} value={cls.class_code}>
                          {cls.class_code}
                        </option>
                      ))}
                    </select>
                  </article>
                  <article className="form-group">
                    <label htmlFor="subjectName" className="form-label">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      id="subjectName"
                      name="subjectName"
                      value={subjectFormData.subjectName}
                      className="form-input"
                      onChange={handleSubjectChange}
                    />
                  </article>
                  <article className="form-group">
                    <label htmlFor="subjectCode" className="form-label">
                      Subject Code
                    </label>
                    <input
                      type="text"
                      id="subjectCode"
                      name="subjectCode"
                      value={subjectFormData.subjectCode}
                      className="form-input"
                      onChange={handleSubjectChange}
                    />
                  </article>
                  <button
                    type="submit"
                    className="form-button"
                    onClick={handleSubjectSubmit}
                  >
                    Add
                  </button>
                  {message}
                </form>
              </div>
            )}
          </>
        </div>
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
