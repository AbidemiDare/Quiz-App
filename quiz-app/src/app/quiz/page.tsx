"use client";

import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import Loader from "../components/loader";
import Link from "next/link";
import Options from "../components/Options";
import Questions from "../components/Questions";
import Buttons from "../components/Buttons";
import Reset from "../components/Reset";
import Timer from "../components/Timer";

interface QuizData {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const Page = () => {
  const [quiz, setQuiz] = useState<QuizData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [activeNumber, setActiveNumber] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [time, setTime] = useState(15 * 60);
  const [showModal, setShowModal] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  // Retrieve the `query` from localStorage on page load
  useEffect(() => {
    const storedQuery = localStorage.getItem("query");
    if (storedQuery) {
      setQuery(storedQuery);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storedQuiz = sessionStorage.getItem("quizData");
        if (storedQuiz) {
          const quizFromStorage = JSON.parse(storedQuiz);
          setQuiz(quizFromStorage);
          setLoading(false);
        } else {
          const response = await fetch(
            "https://opentdb.com/api.php?amount=30&category=9&difficulty=easy&type=multiple"
          );
          const data = await response.json();
          const result: QuizData[] = data.results;

          if (result.length > 0) {
            setQuiz(result);
            sessionStorage.setItem("quizData", JSON.stringify(result));
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hadle Next Function
  const handleNext = useCallback(() => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setActiveNumber(activeNumber + 1);
    }
  }, [currentIndex, quiz.length]);

  const handleSubmit = () => {
    setIsRunning(false);
    setShowModal(true);

    const quizState = JSON.parse(sessionStorage.getItem("quizState") || "{}");

    // Initialize the score and an array for correct answers
    const totalScore = quiz.reduce((score, question, index) => {
      const selectedOption = quizState[index];
      if (selectedOption === question.correct_answer) {
        return score + 1;
      }
      return score;
    }, 0);

    // Get all the correct answers
    const correctAnswers = quiz.map((question, index) => {
      return {
        question: question.question,
        correctAnswer: question.correct_answer,
        selectedAnswer: quizState[index],
        isCorrect: quizState[index] === question.correct_answer,
      };
    });

    setScore(totalScore);
    sessionStorage.setItem("score", JSON.stringify(totalScore));
    sessionStorage.setItem("correctAnswers", JSON.stringify(correctAnswers));
  };

  const handleTryAgain = () => {
    setCurrentIndex(0);
    setActiveNumber(0);
    setShowModal(false);
    setTime(15 * 60);
    setIsRunning(true);

    sessionStorage.removeItem("quizState");
    sessionStorage.setItem("quizTimer", (15 * 60).toString());
  };

  useEffect(() => {
    const storedIndex = sessionStorage.getItem("currentIndex");
    if (storedIndex) {
      setCurrentIndex(Number(storedIndex));
    }
  }, []);

  // handle active question boxes
  const handleActiveQuestion = (index: number) => {
    setActiveNumber(index);
    setCurrentIndex(index);

    sessionStorage.setItem("currentIndex", index.toString());
  };

  const correctAnswers: Answer[] = JSON.parse(
    sessionStorage.getItem("correctAnswers") || "[]"
  );

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative grid grid-cols-1 w-full h-screen bg-[#F9F9F9]">
          <div className="px-4 mx-auto sm:w-3/5 lg:w-2/5 sm:bg-gray-100">
            {/* name tag */}
            <div className="flex mt-4 mb-2 justify-between items-center">
              <h2>
                <span className="text-xl text-black">Welcome,</span>{" "}
                <b className="text-xl text-black">{query.toUpperCase()}!</b>{" "}
              </h2>
            </div>

            {/* Header */}
            <div className="flex mt-0 mb-2 justify-between items-center w-full">
              <Link href="/login">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="text-black lucide lucide-arrow-left text-2xl"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </Link>

              <Timer
                time={time}
                setTime={setTime}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
              />

              <Reset
                setCurrentIndex={setCurrentIndex}
                setActiveNumber={setActiveNumber}
              />
            </div>

            {quiz.length > 0 && !loading ? (
              <>
                <div className="grid gap-1 grid-rows-[auto,1fr,auto]">
                  <div className="transition-opacity duration-300 delay-700 my-2">
                    <Questions currentIndex={currentIndex} quiz={quiz} />

                    <Options
                      quiz={quiz}
                      currentIndex={currentIndex}
                      selectedOption={selectedOption}
                      setSelectedOption={setSelectedOption}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.from({ length: 30 }, (_, i) => {
                      const quizState = JSON.parse(
                        sessionStorage.getItem("quizState") || "{}"
                      );

                      const selectedQuestion = quizState[i];
                      return (
                        <button
                          key={i}
                          className={`text-black font-medium text-sm p-1 px-2 mx-auto ${
                            selectedQuestion
                              ? "bg-gray-500"
                              : activeNumber === i
                              ? "bg-green-400"
                              : "bg-gray-300"
                          }`}
                          onClick={() => handleActiveQuestion(i)}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  <Buttons
                    quiz={quiz}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    activeNumber={activeNumber}
                    setActiveNumber={setActiveNumber}
                    onNext={handleNext}
                  />

                  <div className="mx-auto mt-3">
                    <button
                      type="submit"
                      className="bg-green-600 cursor-pointer text-white text-lg py-4 px-6 tracking-wide rounded-lg"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="font-bold text-lg">Loading...</p>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {showModal && (
        <div className="fixed flex items-center justify-center top-0 left-0 z-30 w-full h-screen bg-black bg-opacity-30">
          <div className="text-center w-[95vw] lg:w-3/5 mx-auto bg-white lg:px-12 rounded-lg shadow-lg p-10">
            <div className="text-xl">
              <p className="text-black text-xl">
                You got{" "}
                <span
                  className={`font-bold ${
                    score > 17 ? "text-green-500" : "text-black"
                  }  ${score < 10 ? "text-red-500" : "text-black"}`}
                >
                  {score}
                </span>{" "}
                out of <span className="font-bold">{quiz.length}</span>
              </p>
            </div>

            {/* Correct answers */}
            <div className="mt-4">
              <h3 className="font-bold text-xl mb-2">Correct Answers</h3>
              <div className="max-h-60 overflow-y-auto">
                {correctAnswers.map((answer, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-medium">
                      {`${index + 1}. ${answer.question}`}
                    </p>
                    <p
                      className={`${
                        answer.isCorrect ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      Correct Answer: {answer.correctAnswer}
                    </p>
                    {answer.selectedAnswer && (
                      <p
                        className={`${
                          answer.isCorrect ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        Your Answer: {answer.selectedAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4 lg:gap-6">
              <button
                type="submit"
                className="bg-yellow-950 text-md text-white rounded-md px-3 py-1 lg:py-3 lg:px-5"
                onClick={handleTryAgain}
              >
                Try again
              </button>
              <Link
                href="/login"
                className="bg-yellow-950 lg:py-3 lg:px-5 rounded-md px-3 py-1 text-white"
              >
                <button>Close</button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* end of modal */}

      {/* modal for timer */}
      {time <= 0 && (
        <div className="fixed flex items-center justify-center top-0 left-0 z-30 w-full h-screen bg-black bg-opacity-30">
          <div className="text-center bg-white lg:px-12 rounded-lg shadow-lg p-10">
            <div>
              <h3 className="text-lg text-black">
                Time elapsed <span className="texxt-black">🕐</span>{" "}
              </h3>
              <div className="text-xl">
                <p className="text-black text-xl">
                  You got{" "}
                  <span
                    className={`font-bold ${
                      score > 17 ? "text-green-500" : "text-black"
                    }  ${score < 10 ? "text-red-500" : "text-black"}`}
                  >
                    {score}
                  </span>{" "}
                  out of <span className="font-bold">{quiz.length}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 lg:gap-6">
              <button
                type="submit"
                className="bg-yellow-950 text-md text-white rounded-md px-3 py-1"
                onClick={handleTryAgain}
              >
                Try again
              </button>
              <Link
                href="/login"
                className="bg-yellow-950 rounded-md px-3 py-1 text-white"
              >
                Close
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* nd of timer modal */}
    </div>
  );
};

export default Page;
