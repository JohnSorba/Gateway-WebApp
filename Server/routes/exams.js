const { Router } = require("express");

const router = Router();

const {
  SubjectController,
  QuestionController,
  QuestionOptionsController,
  ExamController,
  StudentExamController,
  AdminReportController,
} = require("../controllers/exams");

/********SUBJECT ROUTES***********/

// Get all subjects
router.get("/get-subjects", SubjectController.getAllSubjects);

// Add New subject
router.post("/addSubject", SubjectController.addSubject);

// Update subject
router.put("/updateSubject/:subjectId", SubjectController.updateSubject);

// Delete subject
router.delete("/deleteSubject/:subjectId", SubjectController.deleteSubject);

//////////////////////////////////
/*******QUESTION ROUTES*******/

// get classes for add question
router.get("/add-question/classes", QuestionController.getAddQuestionClasses);

// get subjects per classID
router.get(
  "/add-question/subjects/:classId",
  QuestionController.getSubjectsPerClass
);

// Create a question
// router.post("/add-question", QuestionController.createQuestion);
router.post("/add-question", QuestionController.addQuestion);

// Get all questions
router.get("/get-questions", QuestionController.getAllQuestions);

// Get questions with options
router.get(
  "/question-details/:questionId",
  QuestionController.getAllQuestionsWithOptions
);

// Get all questions by subject id
router.get(
  "/get-questions/:subjectId",
  QuestionController.getQuestionsBySubject
);

// Update a question by id
router.put("/update-question/:questionId", QuestionController.updateQuestion);

// Delete a question by id
router.delete(
  "/question/delete/:questionId",
  QuestionController.deleteQuestion
);

/**********QUESTION OPTIONS ROUTES*********** */
// Create option
router.post("/create-option", QuestionOptionsController.createOption);

// Retrieve options by quesiton Id
router.get(
  "/get-options/:questionId",
  QuestionOptionsController.getOptionsByQuestion
);

// Update Options
router.put("/update/:optionId", QuestionOptionsController.updateOption);

// Delete an option
router.delete(
  "/delete-option/:optionId",
  QuestionOptionsController.deleteOption
);

/**********EXAM ROUTES*********** */
// Create exam
router.post("/create-exam", ExamController.createExam);

// Retrieve exam by quesiton Id
router.get("/get-all-exams", ExamController.getAllExams);

// Retrieve exam by quesiton Id
router.get("/get-exam/:examId", ExamController.getExamById);

// get total questions for selected subject
router.get("/total-questions/:subjectId", ExamController.totalQuestions);

// Add Exam Subject
router.post("/:examId/subject", ExamController.addExamSubject);

// Get Details for exam subject edit
router.get(
  "/subject/update-info/:examId/:subjectId",
  ExamController.getExamSubjectDetails
);

// Edit Exam Subject
router.put(
  "/update/exam-subject/:examId/:subjectId",
  ExamController.updateExamSubject
);

// Update exam
router.put("/update-exam/:examId", ExamController.updateExam);

// Delete an exam
router.delete("/delete-exam/:examId", ExamController.deleteExam);

// Delete a subject in an exam
router.delete(
  "/delete/exam-subject/:examId/:subjectId",
  ExamController.deleteExamSubject
);

// Take an exam
router.get("/take-exam/:subjectId", ExamController.takeExam);

////////////////////////
// STUDENT EXAMS ROUTES
////////////////////////

// Fetch all exams
router.get("/student-exam", StudentExamController.getAllExams);

// Fetch by class ID
router.get("/student-exam/:classId", StudentExamController.getExamsByClassId);

router.get(
  "/:examId/class/:classId/:studentId",
  StudentExamController.getStudentExamDetails
);

// Take Exam
router.get(
  "/take-exam/:examId/:subjectId",
  StudentExamController.takeStudentExam
);

// Submit grades
router.post(
  "/submit-grades/:examId/:subjectId",
  StudentExamController.submitExamResult
);

////////////////////////
// EXAM RESULTS //
////////////////////////

// Get Result for admin
router.get("/exam-result", AdminReportController.getAllExamResult);

// Get all Result for admin
router.get("/get-result/:examId", AdminReportController.getAllStudentResult);

// Get student Result for admin
router.get(
  "/student-result/:examId/:studentId",
  AdminReportController.getStudentResultById
);

// Get result for individual student (student dashboard)
router.get("/result/:studentId", AdminReportController.getByStudentId);
module.exports = router;
