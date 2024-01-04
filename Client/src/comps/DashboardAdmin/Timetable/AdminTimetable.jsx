import { useEffect, useState } from "react";
import axios from "axios";
import SubjectAdd from "./SubjectAdd";
import SubjectItem from "./SubjectItem";
import { MdWarning } from "react-icons/md";
import Alert from "../../Utilities/Alert";

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

  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState("");

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
    setAddSubject(true);
    setMessage("");
  };
  // Cancel Add Subject
  const addSubjectModalClose = () => {
    setAddSubject(false);
    setSubjectFormData({
      ...initialSubjectData,
    });
  };

  // Add subject Change handler
  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setSubjectFormData({ ...subjectFormData, [name]: value });
    setMessage("");
  };

  const handleSubjectAdd = () => {
    // Refresh the list after a subject is deleted
    getTimetable(selectedClass);

    setSubjectFormData({
      ...initialSubjectData,
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

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="h-full">
      <div className="flex mb-8">
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
                <TimetableHeader />
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

        {/* Subject Management */}
        <div className="flex flex-col w-3/6 border-l-2 pl-6">
          <h2>Select Class</h2>

          {/* Select Classes from a dropdown list */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
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
              <div className="flex gap-2 items-center text-lg font-semibold text-red-600">
                <MdWarning className="w-6 h-6" />{" "}
                <span>No Subject Selected</span>
              </div>
            ) : (
              <SubjectItem
                subjectFormData={subjectFormData}
                subjects={subjects}
                onDelete={handleSubjectDeleted}
                onUpdate={handleSubjectUpdate}
                onSetMessage={setMessage}
                message={message}
                showAlert={showAlert}
                onSetAlert={setShowAlert}
                onSetType={setType}
              />
            )}
          </div>

          {/* Button to open the add subject modal*/}
          <button onClick={addSubjectModalOpen}>Add New Subject</button>

          {/* Conditional rendering of Subject Adding Form */}
          {addSubject && (
            <div className="modal-backdrop">
              <SubjectAdd
                subjectFormData={subjectFormData}
                onSubjectChange={handleSubjectChange}
                onSubjectAdd={handleSubjectAdd}
                onAddModalClose={addSubjectModalClose}
                classes={classes}
                message={message}
                onSetMessage={setMessage}
                onShowAlert={setShowAlert}
                onSetType={setType}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <button className="form-button" onClick={handleShuffleClick}>
          Shuffle Timetable
        </button>
      </div>

      <Alert
        type={type}
        message={message}
        onClose={handleCloseAlert}
        isVisible={showAlert}
      />
    </div>
  );
}

export default AdminTimetable;

export const TimetableHeader = () => {
  return (
    <thead>
      <tr className="text-sm text-center">
        <th className="w-[80px]">Day</th>
        <th>
          <span>1st Period</span>
          <p>(08:30 - 9:30)</p>
        </th>
        <th>
          <span>2nd Period</span>
          <p>(09:30 - 10:30)</p>
        </th>
        <th>
          <span>Break</span>
          <p>(10:30 - 11:00)</p>
        </th>
        <th>
          <span>3rd Period</span>
          <p>(11:00 - 12:00)</p>
        </th>
        <th>
          <span>4th Period</span>
          <p>(12:00 - 13:00)</p>
        </th>
      </tr>
    </thead>
  );
};
