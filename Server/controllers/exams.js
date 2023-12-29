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
  // Add a new question

  async addQuestion(req, res) {
    try {
      const { newQuestions, options } = req.body;
      console.log("in controller: ", options);

      const resultMessage = await QuestionModel.addQuestion(
        newQuestions.subjectId,
        newQuestions.questionText,
        newQuestions.marks,
        newQuestions.correctOption,
        options
      );

      res.status(201).json(resultMessage);
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
      const { questionText, options } = req.body;

      const updatedQuestion = await QuestionModel.update(
        questionId,
        questionText,
        options
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

      const newExam = await ExamModel.create(examTitle);

      res.status(201).json(newExam);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Add Subjects to Exam
  async addExamSubject(req, res) {
    try {
      const { examId } = req.params;
      const { newSubject } = req.body;

      console.log(examId, newSubject.subjectCode);

      await ExamModel.addExamSubjects(
        examId,
        newSubject.subjectCode,
        newSubject.date,
        newSubject.startTime,
        newSubject.duration,
        newSubject.examType,
        newSubject.numQuestions,
        newSubject.teacherId
      );

      res.status(201).json({ message: "Subject added to exam" });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error(error);
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
  async getExamById(req, res) {
    try {
      const { examId } = req.params;

      const exam = await ExamModel.getById(examId);

      res.json(exam);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update an exam
  async updateExam(req, res) {
    try {
      const { examId } = req.params;
      const { title } = req.body;

      const updatedExam = await ExamModel.update(examId, title);

      res.json(updatedExam);
    } catch (err) {
      // res.status(500).json({ message: err.message });
      res.status(500).send(err);
      console.error(err);
    }
  },

  // Delete an exam
  async deleteExam(req, res) {
    try {
      const { examId } = req.params;

      const result = await ExamModel.delete(examId);

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
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
      res.status(500).json({ error: "Internal Server Error: ", error });
    }
  },
};

const StudentExamController = {
  async getAllExams(req, res) {
    const allExams = await studentExamModel.getAllExams();

    res.status(200).json(allExams);
  },

  async getExamsByClassId(req, res) {
    const { classId } = req.params;

    console.log(classId);

    try {
      const allExams = await studentExamModel.getByClassId(classId);

      // console.log(allExams);

      // console.log("got exams");

      // res.send(allExams);
      res.status(200).json(allExams);
      // res.status(200).json(filteredExams);
    } catch (error) {
      console.error("Error fetching student exams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Retrieve exam details by ID
  async getExamById(req, res) {
    const { classId } = req.params;

    try {
      const allExams = await studentExamModel.getByStudentExamId(classId);

      //Filter subjects basedon the student's class
      const filteredExams = allExams.map((exam) => {
        const filteredSubjects = exam.subjects.filter(
          (subject) => subject.classId === classId
        );
        return { ...exam, subjects: filteredSubjects };
      });

      console.log(filteredExams);

      res.json(exam);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getStudentExamDetails(req, res) {
    const { examId, classId, studentId } = req.params;
    // const { studentId } = req.body;

    console.log("student id: ", studentId);
    console.log("exam id: ", examId);
    console.log("class id: ", classId);

    try {
      const allExams = await studentExamModel.getExamDetailsByClassId(
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

    console.log("subjectId: ", subjectId);
    console.log("examId: ", examId);

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
    const { studentId, marksObtained, isComplete } = req.body;

    try {
      const submitGrade = await studentExamModel.submitExamResult(
        studentId,
        examId,
        subjectId,
        marksObtained,
        isComplete
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
