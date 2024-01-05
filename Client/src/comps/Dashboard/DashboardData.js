export const notice = [
  {
    title: "Notice of Special Examinations of Semester Dec. 2023",
    image: "https://picsum.photos/id/20/50/50",
    author: "Madam Norhayati",
  },
  {
    title: "Timetable Update Released: New Subjects Added",
    image: "https://picsum.photos/id/119/50/50",
    author: "Dr. Aina",
  },
  {
    title: "Time Extension Notice of Semester Admission",
    image: "https://picsum.photos/id/1/50/50",
    author: "Mr. Firdaus",
  },
  {
    title: "Major Project II Deadline Update",
    image: "https://picsum.photos/id/48/50/50",
    author: "Ms. Nor Idayu",
  },
  {
    title: "Scholarship Notice: Oct. 2023 Semester",
    image: "https://picsum.photos/id/60/50/50",
    author: "Ms. Nor Idayu",
  },
];
export const events = [
  {
    title: "Develop User Roles and Access Privileges",
    image: "https://picsum.photos/id/0/50/50",
    date: "2023-11-15",
    location: "Database & Frontend",
  },
  {
    title: "User Account and Session Management",
    image: "https://picsum.photos/id/180/50/50",
    date: "2023-11-25",
    location: "Server & Frontend",
  },
  {
    title: "Update Registration Form (Dual): Admin Privilege",
    image: "https://picsum.photos/id/1/50/50",
    date: "2023-11-20",
    location: "Frontend and Server",
  },
  {
    title: "Create Pupil Dashboard Components",
    image: "https://picsum.photos/id/2/50/50",
    date: "2023-11-20",
    location: "Frontend",
  },
  {
    title: "Create Admin & Teacher Dashboards",
    image: "https://picsum.photos/id/3/50/50",
    date: "2023-11-20",
    location: "Frontend",
  },
  {
    title: "Implement Admin & Teacher Specific Requirements",
    image: "https://picsum.photos/id/4/50/50",
    date: "2023-11-20",
    location: "Frontend & Backend",
  },
  {
    title: "Implement API Endpoints for Client-Server Data Exchange",
    image: "https://picsum.photos/id/5/50/50",
    date: "2023-11-20",
    location: "Server & Database",
  },
  {
    title: "Complete Visual Design of Application Components",
    image: "https://picsum.photos/id/6/50/50",
    date: "2023-11-20",
    location: "Frontend, Design",
  },
  {
    title: "Write Up Privacy Policies and Other Documentation",
    image: "https://picsum.photos/id/7/50/50",
    date: "2023-11-20",
    location: "Review",
  },
];

export const latestNews = [
  {
    title: "Math Bee Competition Winners Announced",
    image: "https://picsum.photos/id/21/50/50",
    date: "2023-11-12",
  },
  {
    title: 'New Book Series Launch: "Adventure Explorers"',
    image: "https://picsum.photos/id/24/50/50",
    date: "2023-11-10",
    source: "School Library",
  },
  {
    title: "Art Showcase Highlights Young Talent",
    image: "https://picsum.photos/id/199/50/50",
    date: "2023-11-14",
    source: "Art Department",
  },
];
export const articles = [
  {
    title: "Fun Science Experiments for Kids",
    image: "https://picsum.photos/id/211/50/50",
    author: "Professor Wonder",
  },
  {
    title: "Explore Your Imagination with Creative Writing",
    image: "https://picsum.photos/id/111/50/50",
    author: "Story Explorer",
  },
  {
    title: "Math Puzzles: A Fun Way to Learn",
    image: "https://picsum.photos/id/256/50/50",
    author: "Puzzle Master",
  },
];

// Admin Home Data
export const studentData = [
  {
    fullName: "John Doe",
    parentName: "Jane Doe",
    phone: "123-456-7890",
    class: "101",
    grade: "A",
    feeStatus: "Paid",
  },
  {
    fullName: "Alice Smith",
    parentName: "Bob Smith",
    phone: "987-654-3210",
    class: "102",
    grade: "B",
    feeStatus: "Unpaid",
  },
  {
    fullName: "Charlie Brown",
    parentName: "Lucy Brown",
    phone: "555-123-4567",
    class: "103",
    grade: "C",
    feeStatus: "Paid",
  },
  {
    fullName: "Eva Martinez",
    parentName: "Carlos Martinez",
    phone: "222-333-4444",
    class: "104",
    grade: "A",
    feeStatus: "Unpaid",
  },
  {
    fullName: "Michael Johnson",
    parentName: "Emily Johnson",
    phone: "999-888-7777",
    class: "105",
    grade: "B",
    feeStatus: "Paid",
  },
];

export const calculateGrade = (grade) => {
  switch (true) {
    case grade > 89:
      return "AA 🎖️";
    case grade > 79:
      return "A 😎";
    case grade > 69:
      return "B 😉";
    case grade > 59:
      return "B- 😃";
    case grade > 49:
      return "C 🙂";
    default:
      return "D 🤡";
  }
};

export const PieChartData = [
  { name: "Boys", value: 6, color: "#0088FE" },
  { name: "Girls", value: 2, color: "#FF8042" },
];

export const localDateString = (date) => {
  const retrievedDate = new Date(date);
  const localDateString = retrievedDate.toLocaleDateString();

  return localDateString;
};

export function convertDateFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JS
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const baseURL = "http://localhost:3000";
