const {
  SubjectModel,
  QuestionModel,
  QuestionOptionsModel,
  ClassModel,
  ExamModel,
  ExamQuestionsModel,
  studentExamModel,
  AdminReportModel,
} = require("../models/exams");
const { StudentModel } = require("../models/student");

const SubjectController = {
  // Retrieve all subjects
  async getAllSubjects(req, res) {
    try {
      const subjects = await SubjectModel.getAll();

      res.status(201).json(subjects);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create a new subject
  async addSubject(req, res) {
    try {
      const { subjectName, subjectCode, classAssigned } = req.body;

      const newSubject = await SubjectModel.add(
        subjectName,
        subjectCode,
        classAssigned
      );

      res.status(200).json(newSubject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Update a subject
  async updateSubject(req, res) {
    try {
      const subjectId = req.params.subjectId;
      const subjectDetails = req.body;

      await SubjectModel.update(subjectId, subjectDetails);

      res.status(200).json({ message: "Subject updated successfully" });
    } catch (error) {
      console.error("Error updating subject: ", error);
      res.status(500).json({ message: "Error updating subject" });
    }
  },

  // Delete a subject
  async deleteSubject(req, res) {
    try {
      const subjectId = req.params.subjectId;

      await SubjectModel.delete(subjectId);
      res.status(204).send({ message: "Subject deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

//****************************************** */
const QuestionController = {
  // get classes for add question
  async getAddQuestionClasses(req, res) {
    try {
      const classes = await QuestionModel.getAddQuestionClasses();

      res.status(201).json(classes);
    } catch (error) {
      console.error("Error adding question: ", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // get subjects based on class ID
  async getSubjectsPerClass(req, res) {
    try {
      const { classId } = req.params;

      const Subjects = await QuestionModel.getSubjectsPerClass(classId);

      res.status(201).json(Subjects);
    } catch (error) {
      console.error("Error adding question: ", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Add a new question

  async addQuestion(req, res) {
    try {
      const { newQuestions, options } = req.body;

      const addedQuestion = await QuestionModel.addQuestion(
        newQuestions.subjectId,
        newQuestions.questionText,
        newQuestions.marks,
        newQuestions.correctOption,
        options
      );

      res.status(201).json(addedQuestion);
    } catch (error) {
      console.error("Error adding question: ", error);
      res.status(500).send("Internal Server Error");
    }
  },

  //********************************* */

  // Retrieve all questions with options
  async getAllQuestionsWithOptions(req, res) {
    const { questionId } = req.params;

    try {
      const questionsWithOptions = await QuestionModel.getQuestionsWithOptions(
        questionId
      );

      res.json(questionsWithOptions);
    } catch (error) {
      console.error("Error fetching questions: ", error);
      res.status(500).send("Internal Server Error: ", error);
    }
  },

  // Retrieve questions by subject
  async getAllQuestions(req, res) {
    try {
      const questions = await QuestionModel.getAllQuestions();

      res.json(questions);
    } catch (err) {
      // res.status(500).json({ message: err.message });
      res.status(500).json({ message: "Error adding question", err });
    }
  },

  // Retrieve questions by subject
  async getQuestionsBySubject(req, res) {
    try {
      const { subjectId } = req.params;

      const questions = await QuestionModel.getBySubject(subjectId);

      res.json(questions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },

  // Update a question
  async updateQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const { questionText, options, marks, correctOption } = req.body;

      const updatedQuestion = await QuestionModel.update(
        questionId,
        questionText,
        options,
        marks,
        correctOption
      );

      res.status(200).json(updatedQuestion);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Delete a question
  async deleteQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const result = await QuestionModel.delete(questionId);

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

const QuestionOptionsController = {
  // Add options to a question
  async createOption(req, res) {
    try {
      const { questionId, options } = req.body;

      const newOption = await QuestionOptionsModel.create(questionId, options);

      res.status(201).json(newOption);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Retrieve options for a question
  async getOptionsByQuestion(req, res) {
    try {
      const { questionId } = req.params;

      const options = await QuestionOptionsModel.getByQuestion(questionId);

      res.json(options);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update an option
  async updateOption(req, res) {
    try {
      const { optionId } = req.params;
      const { optionText, isCorrect } = req.body;

      const updatedOption = await QuestionOptionsModel.update(
        optionId,
        optionText,
        isCorrect
      );

      res.json(updatedOption);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Delete an option
  async deleteOption(req, res) {
    try {
      const { optionId } = req.params;

      await QuestionOptionsModel.delete(optionId);

      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

const ClassController = {
  async getClassTimetable(req, res) {
    const classCode = await req.params.classCode;

    try {
      const subjects = await ClassModel.getSubjectsPerClass(classCode);

      const timetable = generateTimetable(subjects);

      return res.status(200).json({ subjects, timetable });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error fetching timetable" });
    }
  },
};

const ExamController = {
  // Create a new exam
  async createExam(req, res) {
    try {
      const { examTitle } = req.body;

      const newExam = await ExamModel.createExam(examTitle);

      res.status(201).json(newExam);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // get total questions for subject
  async totalQuestions(req, res) {
    try {
      const { subjectId } = req.params;

      const totalQuestions = await ExamModel.totalQuestions(subjectId);

      res.status(201).json(totalQuestions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Add Subjects to Exam
  async addExamSubject(req, res) {
    try {
      const { examId } = req.params;
      const { newSubject } = req.body;

      const result = await ExamModel.addExamSubject(
        examId,
        newSubject.subjectCode,
        newSubject.date,
        newSubject.startTime,
        newSubject.duration,
        newSubject.totalQuestions
      );

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error(error);
    }
  },

  // publish exam for students
  async publishExamSubjects(req, res) {
    try {
      const { examId } = req.params;

      const result = await ExamModel.publishExamSubjects(examId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Retrieve all exams
  async getAllExams(req, res) {
    try {
      const exams = await ExamModel.getAllExams();

      res.status(201).json(exams);
    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  },

  // Retrieve exam details by ID
  async getExamDetailsById(req, res) {
    try {
      const { examId } = req.params;

      const exam = await ExamModel.getExamDetailsById(examId);

      res.json(exam);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // fetch exam subject details for update
  async getExamSubjectDetails(req, res) {
    const { examId, subjectId } = req.params;

    try {
      const examSubjectUpdateDetails = await ExamModel.getExamSubjectDetails(
        examId,
        subjectId
      );

      res.status(200).json(examSubjectUpdateDetails);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // update subject in selected exam
  async updateExamSubject(req, res) {
    const { examId, subjectId } = req.params;
    const { editSubject } = req.body;

    try {
      const examSubjectUpdate = await ExamModel.updateExamSubject(
        examId,
        subjectId,
        editSubject.date,
        editSubject.startTime,
        editSubject.duration,
        editSubject.totalQuestions
      );

      res.status(200).json(examSubjectUpdate);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Delete a subject from an exam
  async deleteExamSubject(req, res) {
    try {
      const { examId, subjectId } = req.params;

      const result = await ExamModel.deleteExamSubject(examId, subjectId);

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ type: "failure", message: err.message });
    }
  },

  // Update an exam title
  async updateExamTitle(req, res) {
    try {
      const { examId } = req.params;
      const { title } = req.body;

      const updatedExam = await ExamModel.updateExamTitle(examId, title);

      res.json(updatedExam);
    } catch (err) {
      res.status(500).json({ type: "failure", message: "Cannot Update Exam!" });
    }
  },

  // Delete an exam
  async deleteExam(req, res) {
    try {
      const { examId } = req.params;

      const result = await ExamModel.deleteExam(examId);

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ type: "failure", message: err.message });
    }
  },

  // TAKE EXAM: Retrieve all questions with options
  async takeExam(req, res) {
    const { subjectId } = req.params;

    console.log(subjectId);

    try {
      const questionsWithOptions = await ExamModel.getQuestionsForExam(
        subjectId
      );

      res.json(questionsWithOptions);
    } catch (error) {
      console.error("Error fetching questions: ", error);
      res
        .status(500)
        .json({ type: "failure", error: "Internal Server Error: ", error });
    }
  },
};

const StudentExamController = {
  async getAllExams(req, res) {
    const allExams = await studentExamModel.getAllExams();

    res.status(200).json(allExams);
  },

  // fetch examId for displaying relevant exams on exam list page
  async getExamIdForExamListDisplay(req, res) {
    try {
      const examId = await studentExamModel.getExamIdForExamListDisplay();

      res.status(200).json(examId);
    } catch (error) {
      console.error("Error fetching student exams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async getExamsByClassId(req, res) {
    const { classId, studentId } = req.params;

    try {
      const allExams = await studentExamModel.getExamsByClassId(
        classId,
        studentId
      );

      res.status(200).json(allExams);
    } catch (error) {
      console.error("Error fetching student exams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async getExamDetailsByClassIdAndStudentId(req, res) {
    const { examId, classId, studentId } = req.params;

    try {
      const allExams =
        await studentExamModel.getExamDetailsByClassIdAndStudentId(
          examId,
          classId,
          studentId
        );

      res.status(200).json(allExams);
    } catch (error) {
      console.error("Error fetching student exams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // TAKE EXAM: Retrieve all questions with options
  async takeStudentExam(req, res) {
    const subjectId = req.params.subjectId;
    const examId = req.params.examId;

    try {
      const { questionsWithOptions, numQuestions } =
        await ExamModel.getQuestionsForExam(subjectId, examId);

      res.json({ questionsWithOptions, numQuestions });
    } catch (error) {
      console.error("Error fetching questions: ", error);
      res.status(500).json({ error: error });
    }
  },

  // Submit grades for exam
  async submitExamResult(req, res) {
    const { examId, subjectId } = req.params;
    const { studentId, marksObtained, isComplete, classCode } = req.body;

    try {
      const submitGrade = await studentExamModel.submitExamResult(
        studentId,
        examId,
        subjectId,
        marksObtained,
        isComplete,
        classCode
      );

      res.status(200).json({ message: submitGrade });
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

const AdminReportController = {
  // Get By Exams
  async getAllExamResult(req, res) {
    // const {query} = req.params;
    try {
      const result = await AdminReportModel.getAllExamResult();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  // Get all reports
  async getAllStudentResult(req, res) {
    const { examId } = req.params;

    try {
      const result = await AdminReportModel.getAllStudentResult(examId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  // Get all reports
  async getStudentResultById(req, res) {
    const { studentId, examId } = req.params;
    // console.log("student ID: ", studentId);

    try {
      const result = await AdminReportModel.getStudentResultById(
        studentId,
        examId
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  // Get by student ID
  async getByStudentId(req, res) {
    const { studentId } = req.params;
    try {
      const result = await AdminReportModel.getByStudentId(studentId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};

module.exports = {
  SubjectController,
  QuestionController,
  QuestionOptionsController,
  ClassController,
  ExamController,
  StudentExamController,
  AdminReportController,
};
