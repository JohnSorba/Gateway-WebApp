const {
  SubjectModel,
  QuestionModel,
  QuestionOptionsModel,
  ClassModel,
  ExamModel,
  ExamQuestionsModel,
} = require("../models/exams");

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
  async createQuestion(req, res) {
    try {
      const { newQuestions, options } = req.body;

      const createdQuestion = await QuestionModel.create(
        newQuestions.subjectId,
        newQuestions.questionText,
        newQuestions.marks,
        newQuestions.correctOption,
        options
      );

      res.status(200).json(createdQuestion);
    } catch (err) {
      res.status(500).json({ message: err.message });
      console.error(err);
    }
  },

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

      res.json({ updatedQuestion, options });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Delete a question
  async deleteQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const result = await QuestionModel.delete(questionId);

      res.status(200).json({ message: result });
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
      const { title } = req.body;

      const newExam = await ExamModel.create(title);

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

      await ExamModel.delete(examId);

      res.status(204).json({ message: "Exam deleted successfully" });
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
      res.status(500).send("Internal Server Error: ", error);
    }
  },
};

module.exports = {
  SubjectController,
  QuestionController,
  QuestionOptionsController,
  ClassController,
  ExamController,
};
