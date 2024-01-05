const { Router } = require("express");

const router = Router();

const {
  SubjectController,
  QuestionController,
  QuestionOptionsController,
  ExamController,
} = require("../controllers/exams");

//////////////////////////////////////////////////////
/********SUBJECT ROUTES***********/

// Get all subjects
router.get("/get-subjects", SubjectController.getAllSubjects);

// Add New subject
router.post("/addSubject", SubjectController.addSubject);

// Update subject
router.put("/updateSubject/:subjectId", SubjectController.updateSubject);

// Delete subject
router.delete("/deleteSubject/:subjectId", SubjectController.deleteSubject);

///////////////////////////////////////////////////////
/*******QUESTION ROUTES*******/

// get classes for add question
router.get("/add-question/classes", QuestionController.getAddQuestionClasses);

// get subjects per classID
router.get(
  "/add-question/subjects/:classId",
  QuestionController.getSubjectsPerClass
);

//////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////
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

///////////////////////////////////////////////////
/**********EXAM ROUTES*********** */
// Create exam
router.post("/create-exam", ExamController.createExam);

// get total questions for selected subject
router.get("/total-questions/:subjectId", ExamController.totalQuestions);

// Add Exam Subject
router.post("/:examId/subject", ExamController.addExamSubject);

// Publish exam after subject adding
router.post("/publish/:examId", ExamController.publishExamSubjects);

// Retrieve all exams for home page
router.get("/get-all-exams", ExamController.getAllExams);

router.get("/get-total-exams", ExamController.getTotalExams);

// Retrieve exam draft details by Id
router.get(
  "/exam-details/draft/:examId",
  ExamController.getExamDraftDetailsById
);

// get ongoing exam details
router.get(
  "/exam-details/ongoing/:examId",
  ExamController.getOngoingExamDetails
);

// get mark exam complete
router.get("/exam-complete/:examId", ExamController.markExamComplete);

// fetch exam subject details for update
router.get(
  "/subject/update-info/:examId/:subjectId",
  ExamController.getExamSubjectDetails
);

// Update subject in selected exam
router.put(
  "/update/exam-subject/:examId/:subjectId",
  ExamController.updateExamSubject
);

// Delete a subject from an exam
router.delete(
  "/delete/exam-subject/:examId/:subjectId",
  ExamController.deleteExamSubject
);

// Update an exam title
router.put("/update-exam/:examId", ExamController.updateExamTitle);

// Delete an exam
router.delete("/delete-exam/:examId", ExamController.deleteExam);

module.exports = router;
