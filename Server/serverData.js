const localDateString = (date) => {
  const retrievedDate = new Date(date);
  const localDateString = retrievedDate.toLocaleDateString();

  return localDateString;
};

function convertDateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JS
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
// function to compare time received to that in the database to ensure exams are only created during school hours
const compareTime = (time) => {
  // 'time' is the string passed in

  let date = new Date();

  // Create a new date object for 08:30 AM
  let schoolStartTime = new Date(date);
  schoolStartTime.setHours(8);
  schoolStartTime.setMinutes(30);
  schoolStartTime.setSeconds(0);
  schoolStartTime.setMilliseconds(0);

  // Create a new Date object for 1:00 PM
  let schoolEndTime = new Date(date);
  schoolEndTime.setHours(12); // 13 is 1:00 PM in 24-hour format
  schoolEndTime.setMinutes(15);
  schoolEndTime.setSeconds(0);
  schoolEndTime.setMilliseconds(0);

  // compare times
  // Split the string into hours and minutes
  let [receivedHours, receivedMinutes] = time.split(":");

  // Create a new Date object for the received time
  let receivedTime = new Date(date);
  receivedTime.setHours(receivedHours);
  receivedTime.setMinutes(receivedMinutes);
  receivedTime.setSeconds(0);
  receivedTime.setMilliseconds(0);

  let isWithinSchoolTime = false;

  // Compare received time with school time

  if (receivedTime >= schoolStartTime && receivedTime <= schoolEndTime) {
    isWithinSchoolTime = true;
    // console.log("the received time falls within the school time!");
  } else {
    isWithinSchoolTime = false;
    // console.log("the received time does not fall within the school time!");
  }

  return isWithinSchoolTime;
};

const scheduleExamLater = (date) => {
  // Get the current date for today
  let dateToday = new Date().toLocaleDateString();

  // Assume examDate is the date you plan to schedule the exam
  let scheduledDate = localDateString(date);

  let dateHasPassed = false;

  if (scheduledDate <= dateToday) {
    dateHasPassed = true;
  } else {
    dateHasPassed = false;
  }

  return dateHasPassed;
};

module.exports = {
  compareTime,
  scheduleExamLater,
};
