import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [timetable, setTimetable] = useState([]);
  console.log(timetable);

  useEffect(() => {
    axios
      .get(`/timetable`)
      .then((response) => {
        setTimetable(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {/* <h2>Timetable for class 1</h2>

      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Period</th>
            <th>Subject</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((entry) => (
            <tr key={entry.period}>
              <td>{entry.day}</td>
              <td>{entry.period}</td>
              <td>{entry.subject}</td>
              <td>{entry.teacher}</td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <Link to="/">Back to Flash Screen</Link>
    </div>
  );
}

export default HomePage;
