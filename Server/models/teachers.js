const pool = require("../db");

const TeacherModel = {
  async getTeacherById(userId) {
    const query = `
    SELECT t.*, td.*, class_code
        FROM teachers t
        JOIN teacher_employee_details td
        ON t.teacher_id = td.teacher_id
        JOIN teacher_classes tc
        ON t.teacher_id = tc.teacher_id
        WHERE user_id = $1`;

    const result = await pool.query(query, [userId]);

    return result.rows[0];
  },

  // get account information
  async getAccountInfo(userId) {
    const query = `
      SELECT * FROM user_accounts
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);

    return result.rows[0];
  },

  // get timetable
  async getTimetable(classId) {
    const query = "SELECT * FROM ";
  },
};

const TeacherAttendanceModel = {
  // Retrieve class students
  async getStudentsByClass(classId) {
    const query = `
      SELECT s.student_id, s.first_name, s.last_name
      FROM students s
      JOIN student_admission sa ON sa.student_id = s.student_id
      JOIN classes c ON c.class_code = sa.class_code
      WHERE c.class_code = $1
    `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },

  // add attendance
  async addAttendanceStatus(attendanceDetails) {
    const { classId, attendanceDate, details } = attendanceDetails;

    const localDateString = (date) => {
      const retrievedDate = new Date(date);
      const localDateString = retrievedDate.toLocaleDateString();

      return localDateString;
    };

    // convert the received date (MM/DD/YYYY) into the database format (YYYY-MM-DD)
    const parts = attendanceDate.split("/");
    const postgresCompatibleDate = `${parts[2]}-${parts[0]}-${parts[1]}`;

    // Retrieve date from the attendance table
    const dateResult = await pool.query(
      "SELECT * FROM attendance WHERE attendance_date = $1 AND class_code = $2",
      [postgresCompatibleDate, classId]
    );

    // if record exists, check whether the date received as parameter matches any date in the database
    if (dateResult.rows.length > 0) {
      // store date value in variable
      const attendanceDatabaseDate = dateResult.rows[0].attendance_date;
      // convert date from database and date received from endpoint to the same format
      const databaseConverted = localDateString(attendanceDatabaseDate);
      const newAttendanceDate = localDateString(postgresCompatibleDate);

      // check if the date received matches any date in the database
      if (databaseConverted === newAttendanceDate) {
        return { type: "failure", message: "Today's entry updated already!" };
      }
    }

    const query =
      "INSERT INTO attendance (student_id, class_code, attendance_date, status) VALUES ($1, $2, $3, $4)";

    try {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        // loop through each element in the detail array and add the accompanying classId and date
        for (const detail of details) {
          await client.query(query, [
            detail.studentId,
            classId,
            postgresCompatibleDate,
            detail.attendanceStatus,
          ]);
        }

        await client.query("COMMIT");

        return {
          type: "success",
          message: `Attendance Record Created for today (${postgresCompatibleDate})`,
        };
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Attendance Record could not be added!", error);

        return {
          type: "failure",
          message: "Attendance Record could not be added!",
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  },

  // get attendance record by date
  async getAttendanceByDate(classId) {
    const query = `
    SELECT 
      a.attendance_date AS date,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
    FROM
      attendance a
    JOIN 
      classes c ON c.class_code = a.class_code
    WHERE
      c.class_code = $1
    GROUP BY
      a.attendance_date, c.class_code
    ORDER BY
      a.attendance_date
  
      `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      console.error;

      throw error;
    }
  },

  // get attendance record by students
  async getAttendanceByStudents(classId) {
    const query = `
    SELECT 
      a.student_id, s.first_name, s.last_name,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
    FROM
      attendance a
    JOIN
      students s ON s.student_id = a.student_id
    JOIN 
      classes c ON c.class_code = a.class_code
    WHERE
      c.class_code = $1
    GROUP BY
      a.student_id, s.first_name, s.last_name, c.class_code
    ORDER BY
      a.student_id
  
      `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      console.error;

      throw error;
    }
  },

  // view attendance records
  async viewAttendanceRecords(classId, date) {
    const query = `
      SELECT a.*, s.first_name, s.last_name
      FROM attendance a
      JOIN students s ON s.student_id = a.student_id
      WHERE class_code = $1
      AND a.attendance_date = $2
    `;

    try {
      const result = await pool.query(query, [classId, date]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // view attendance records
  async viewDailyStudentsAttendance(classId, studentId) {
    const query = `
      SELECT a.student_id, a.attendance_date AS date, a.status
      FROM attendance a
      WHERE class_code = $1
      AND a.student_id = $2
    `;

    try {
      const result = await pool.query(query, [classId, studentId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // view attendance record by student id
  async viewStudentAttendance(studentId) {
    try {
      const result = await pool.query(
        "SELECT * FROM attendance WHERE student_id = $1",
        [studentId]
      );

      return result.rows;
    } catch (error) {
      console.log("Error fetching student attendance");
    }
  },
};

const TeacherReportModel = {
  // Get report by exam

  async getAllExamResultByClass(classId) {
    console.log(classId);

    const query = `
      SELECT DISTINCT e.*, seg.completed 
      FROM student_exam_grades seg
      JOIN exams e
      ON e.exam_id = seg.exam_id
      WHERE seg.completed = true
      AND e.status = 'completed'
      AND seg.class_code = $1
      `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  /////////////////////////////////////////////////
  // GET ALL STUDENTS FOR A SPECIFIC EXAM
  // Get report result for all students in class
  async getReportExamDetailsById(examId, classId) {
    const query = `
      SELECT 
        seg.student_id, AVG(seg.marks_obtained) AS average_grade, s.first_name, s.last_name, su.class_assigned 
      FROM 
        student_exam_grades seg
      JOIN 
        students s ON s.student_id = seg.student_id
      LEFT JOIN 
        subjects su ON su.subject_code = seg.subject_code
      WHERE 
        seg.exam_id = $1 and seg.class_code = $2
      GROUP BY 
        seg.student_id, s.first_name, s.last_name, su.class_assigned
  
      `;

    try {
      const result = await pool.query(query, [examId, classId]);

      return result.rows;
    } catch (error) {
      console.log("Cannot display all student results");
      throw error;
    }
  },

  /////////////////////////////////////////////////
  // GET DETAILS FOR INDIVIDUAL STUDENT
  // Get Individaul Student Result
  async getStudentResultById(studentId, classId, examId) {
    const query = `
        SELECT 
          seg.*, e.title, e.date_created, s.first_name, s.last_name, s.age, su.*
        FROM 
          student_exam_grades seg
        JOIN 
          exams e ON e.exam_id = seg.exam_id
        JOIN students s
        ON s.student_id = seg.student_id
        LEFT JOIN subjects su
        ON su.subject_code = seg.subject_code
        WHERE 
          seg.student_id = $1 AND seg.exam_id = $2 AND seg.class_code = $3
    
        `;

    try {
      const result = await pool.query(query, [studentId, examId, classId]);

      return result.rows;
    } catch (error) {
      console.log("Cannot display Individual results");
      throw error;
    }
  },
};

const TeacherExamModel = {
  // Get all exams for displaying list of all exams created
  async getAllExamsByClass(classId) {
    console.log(classId);

    const query = `
        SELECT DISTINCT(e.* )
        FROM exams e
        JOIN 
          student_exam_grades seg
        ON 
          seg.exam_id = e.exam_id
          WHERE seg.class_code = $1
          AND seg.completed = true

          ORDER BY e.date_created DESC
        `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      console.log(error);

      return {
        type: "failure",
        message: "Cannot fetch exams",
      };
    }
  },

  // Get exam details for Ongoing exam for a class
  async getOngoingExamDetails(examId, classId) {
    // This query returns the total number of students in each class in an
    // exam and also the total students who have not completed an exam
    const query = `
      WITH class_student_count AS (
        SELECT c.class_code, COUNT(DISTINCT s.student_id) as total_students
        FROM classes c
        join student_admission sa on sa.class_code = c.class_code
        JOIN students s ON s.student_id = sa.student_id
        GROUP BY c.class_code
      ),  
      
      exam_taken_count AS (
        SELECT seg.class_code, COUNT(DISTINCT seg.student_id) as students_taken_exam
        FROM student_exam_grades seg
        WHERE seg.exam_id = $1 AND seg.class_code = $2
        GROUP BY seg.class_code
      )
  
      SELECT csc.class_code, csc.total_students, etc.students_taken_exam
      FROM class_student_count csc
      JOIN exam_taken_count etc ON csc.class_code = etc.class_code
      `;

    try {
      const result = await pool.query(query, [examId, classId]);

      return result.rows;
    } catch (error) {
      return {
        type: "failure",
        message: "Cannot retrieve details for ongoing exams!",
      };
    }
  },

  // know when all students have taken an exam and update the exam status for a class
  async markExamComplete(examId, classId) {
    // Fetch total students in exam class and total students
    // who have completed the exam

    const query = `
    WITH class_student_count AS (
      SELECT
        c.class_code,
        COUNT(DISTINCT s.student_id) as total_students
      FROM classes c
      JOIN student_admission sa ON sa.class_code = c.class_code
      JOIN students s ON s.student_id = sa.student_id
      WHERE c.class_code = $2
      GROUP BY c.class_code
    ),
    exam_taken_count AS (
      SELECT
        seg.class_code,
        COUNT(DISTINCT seg.student_id) as students_taken_exam
      FROM student_exam_grades seg
      WHERE seg.exam_id = $1 AND seg.class_code = $2
      GROUP BY seg.class_code
    )
  
    SELECT
      csc.class_code,
      csc.total_students,
      etc.students_taken_exam
    FROM class_student_count csc
    JOIN exam_taken_count etc ON csc.class_code = etc.class_code;
  `;

    // check if examId has been updated for a class
    const updatedExamIdQuery = await pool.query(
      "SELECT * FROM exams where exam_id = $1",
      [examId]
    );

    try {
      const totalStudentsResult = await pool.query(query, [examId, classId]);

      const { rows } = totalStudentsResult;

      console.log("for teacher: ", totalStudentsResult.rows);

      // Check if all students have completed the exam
      const allStudentsCompleted = rows.every(
        (row) => row.students_taken_exam === row.total_students
      );

      // Ensure the status doesn't get updated when both values equal zero
      for (let row of rows) {
        if (
          row.total_students === row.total_students &&
          row.students_taken_exam === 0
        ) {
          // Stops the function execution
          return;
        }

        // Update status code here
        if (!allStudentsCompleted) {
          // If not all completed, update the exams table to mark the exam as incomplete
          await pool.query("UPDATE exams SET status = $1 WHERE exam_id = $2", [
            null,
            examId,
          ]);
        } else if (allStudentsCompleted) {
          // if all completed, update the exams table to mark the exam as complete
          await pool.query("UPDATE exams SET status = $1 WHERE exam_id = $2", [
            "completed",
            examId,
          ]);
        }
      }

      return totalStudentsResult.rows;

      const completeStatus = updatedExamIdQuery.rows[0].status;
      if (completeStatus === "completed") {
        return;
      }
    } catch (error) {
      return {
        type: "failure",
        message: "Students have not completed the exams!",
      };
    }
  },
};

module.exports = {
  TeacherModel,
  TeacherAttendanceModel,
  TeacherReportModel,
  TeacherExamModel,
};
//https://i.pravatar.cc/300?u=194533
