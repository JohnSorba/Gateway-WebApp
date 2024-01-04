/* eslint-disable react/prop-types */
/* eslint-disable no-case-declarations */
import { useEffect, useReducer, useState } from "react";
import Header from "./TakeExam/Header";
import Loader from "../../../Loader";
import Error from "./TakeExam/Error";
import StartScreen from "./TakeExam/StartScreen";
import Question from "./TakeExam/Question";
import NextButton from "./TakeExam/NextButton";
import Main from "./TakeExam/Main";
import Progress from "./TakeExam/Progress";
import FinishScreen from "./TakeExam/FinishScreen";
import Timer from "./TakeExam/Timer";
import Footer from "./TakeExam/Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseURL } from "../DashboardData";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'examCompleteded'
  status: "loading",
  index: 0,
  correctOption: null,
  marks: 0,
  highscore: 0,
  secondsRemaining: null,
};

const actions = {
  type: "",
  payload: null,
};
console.log(actions);

// state: is the current state of the component
// action: an object that represents the action dispatched (has a type and payload property)

// function reducer(curState, obj)
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newCorrectOption":
      const question = state.questions.at(state.index);

      return {
        ...state,
        correctOption: action.payload,
        marks:
          action.payload === question.correctOption
            ? state.marks + question.marks
            : state.marks,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        correctOption: null,
      };
    case "examCompleted":
      return {
        ...state,
        status: "examCompleteded",
        highscore:
          state.marks > state.highscore ? state.marks : state.highscore,
      };

    case "navigateToExamDetails":
      return {};

    case "removeCompletedExam":
      return {};

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        highscore: state.highscore,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "examCompleteded" : state.status,
      };

    default:
      throw new Error("Action Unknown");
  }
}

export default function TakeExam() {
  const [
    {
      questions,
      status,
      index,
      correctOption,
      marks,
      highscore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const [numberOfQuestions, setNumberOfQuestions] = useState(null);

  const { subjectId, examId } = useParams();
  // console.log(subjectId);

  const numQuestions = numberOfQuestions;
  const maxPossibleMarks = questions.reduce((prev, cur) => prev + cur.marks, 0);

  // Fetch data on MOUNT (include [])
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/student/take-exam/${examId}/${subjectId}`
        );

        if (response.data) {
          dispatch({
            type: "dataReceived",
            payload: response.data.questionsWithOptions,
          });
          setNumberOfQuestions(response.data.numQuestions);
        }
      } catch (error) {
        console.error("Error fetching questions", error);
        dispatch({ type: "dataFailed" });
      }
    };

    fetchQuestions();
  }, [subjectId, examId]);

  return (
    <div className="take-exam">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            questions={questions}
            dispatch={dispatch}
          />
        )}

        {status === "active" && (
          // Multiple Components must be wrapped in a <Fragment />
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              marks={marks}
              maxPossibleMarks={maxPossibleMarks}
              correctOption={correctOption}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              correctOption={correctOption}
            />
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                dispatch={dispatch}
                correctOption={correctOption}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === "examCompleteded" && (
          <FinishScreen
            marks={marks}
            maxPossibleMarks={maxPossibleMarks}
            highscore={highscore}
            dispatch={dispatch}
            examId={examId}
            subjectId={subjectId}
          />
        )}
      </Main>
    </div>
  );
}
