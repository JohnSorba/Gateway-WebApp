import { useState, useEffect } from "react";
import moment from "moment";

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const formattedDateTime = moment().format(
        "dddd, Do MMMM, YYYY (HH:mm:ss)"
      );
      setCurrentDateTime(formattedDateTime);
    };

    // Update the date and time every second
    const interval = setInterval(updateDateTime, 1000);

    // Initial update
    updateDateTime();

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 text-lg">
      <p>{currentDateTime}</p>
    </div>
  );
};

export default DateTimeDisplay;
