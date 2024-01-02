// function formatDate(date) {
//   // Ensure the input is a valid Date object
//   if (!(date instanceof Date) || isNaN(date)) {
//     throw new Error("Invalid date input");
//   }

//   // Get the year, month, and day components
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
//   const day = date.getDate().toString().padStart(2, "0");

//   // Assemble the formatted date string
//   const formattedDate = `${year}-${month}-${day}`;

//   return formattedDate;
// }

// function formatTime(timeString) {
//   // Ensure the input is a valid time string
//   const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
//   if (!timeRegex.test(timeString)) {
//     throw new Error("Invalid time input");
//   }

//   // Add seconds part if not present
//   const formattedTime = timeString.includes(":")
//     ? `${timeString}:00`
//     : timeString;

//   return formattedTime;
// }
