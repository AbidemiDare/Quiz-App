import React, { useEffect, useState } from "react";
// Define the type for the question prop

interface QuizData {
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
}

interface OptionProps {
  quiz: QuizData[];
  currentIndex: number;
  selectedOption: string;
  setSelectedOption: (selectedOption: string) => void;
}

const Options: React.FC<OptionProps> = ({
  quiz,
  currentIndex,
  selectedOption,
  setSelectedOption,
}) => {
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const handleClickOption = (option: string) => {
    setSelectedOption(option);

    const quizState = JSON.parse(sessionStorage.getItem("quizState") || "{}");
    quizState[currentIndex] = option;
    sessionStorage.setItem("quizState", JSON.stringify(quizState));
  };

  function decodeHtmlEntity(str: string) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent || doc.body.textContent;
  }

  const shuffleAnswers = (array: string[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[j], shuffledArray[i]] = [
        shuffledArray[i],
        shuffledArray[j],
      ];
    }

    return shuffledArray;
  };

  useEffect(() => {
    if (quiz.length > 0) {
      const currentQuestion = quiz[currentIndex];

      const savedShuffledOptions = JSON.parse(
        sessionStorage.getItem("quizQuestions") || "{}"
      );

      if (!savedShuffledOptions[currentIndex]) {
        const options = [
          ...currentQuestion.incorrect_answers,
          currentQuestion.correct_answer,
        ];

        const shuffled = shuffleAnswers(options);
        setShuffledOptions(shuffled);

        savedShuffledOptions[currentIndex] = shuffled;
        sessionStorage.setItem(
          "quizQuestions",
          JSON.stringify(savedShuffledOptions)
        );
      } else {
        setShuffledOptions(savedShuffledOptions[currentIndex]);
      }

      const quizState = JSON.parse(sessionStorage.getItem("quizState") || "{}");
      setSelectedOption(quizState[currentIndex] || "");
    }
  }, [quiz, currentIndex]);

  return (
    <form>
      {shuffledOptions.map((option, index) => (
        <label
          className={`list-decimal text-sm text-gray-500 flex items-center gap-2 rounded-md w-full transition-all cursor-pointer delay-75 mb-1 py-1`}
          key={`${option}-${index}`}
        >
          {" "}
          <input
            type="radio"
            name="radio"
            value={option}
            checked={selectedOption === option}
            onChange={() => handleClickOption(option)}
          />
          <span className="tracking-wide font-medium text-md text-black">
            {shuffledOptions.length > 0 ? decodeHtmlEntity(option) : " "}
          </span>
        </label>
      ))}
    </form>
  );
};

export default Options;
