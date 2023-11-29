const { Router } = require("express");

const router = Router();

const {
  SubjectController,
  QuestionController,
  QuestionOptionsController,
  ExamController,
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

/*******QUESTION ROUTES*******/

// Create a question
// router.post("/add-question", QuestionController.createQuestion);
router.post("/add-question", QuestionController.addQuestion);

// Get all questions
router.get("/get-questions", QuestionController.getAllQuestions);

// Get all questions by subject id
router.get(
  "/get-questions/:subjectId",
  QuestionController.getQuestionsBySubject
);

// Update a question by id
router.put("/update-question/:questionId", QuestionController.updateQuestion);

// Delete a question by id
router.delete(
  "/delete-question/:questionId",
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

// Update exam
router.put("/update-exam/:examId", ExamController.updateExam);

// Delete an exam
router.delete("/delete-exam/:examId", ExamController.deleteExam);

module.exports = router;
