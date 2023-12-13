const { Router } = require("express");

const router = Router();

const {
  SubjectController,
  QuestionController,
  QuestionOptionsController,
  ExamController,
  StudentExamController,
} = require("../controllers/exams");
const { studentExamModel } = require("../models/exams");

/********SUBJECT ROUTES***********/

// Get all subjects
router.get("/get-subjects", SubjectController.getAllSubjects);

// Add New subject
router.post("/addSubject", SubjectController.addSubject);

// Update subject
router.put("/updateSubject/:subjectId", SubjectController.updateSubject);

// Delete subject
router.delete("/deleteSubject/:subjectId", SubjectController.deleteSubject);

/*******QUESTION ROUTES*******/

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

// Add Exam Subject
router.post("/:examId/subject", ExamController.addExamSubject);

// Update exam
router.put("/update-exam/:examId", ExamController.updateExam);

// Delete an exam
router.delete("/delete-exam/:examId", ExamController.deleteExam);

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
  "/:examId/class/:classId",
  StudentExamController.getStudentExamDetails
);

// Take Exam
router.get(
  "/take-exam/:examId/:subjectId",
  StudentExamController.takeStudentExam
);
module.exports = router;
