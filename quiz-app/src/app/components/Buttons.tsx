import React from "react";

interface QuizData {
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
}

interface ButtonsProps {
  quiz: QuizData[];
  currentIndex: number;
  setCurrentIndex: (currentIndex: number) => void;
  // handleNext: VoidFunction;
  activeNumber: number;
  setActiveNumber: (activeNumber: number) => void;
  onNext: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Buttons: React.FC<ButtonsProps> = ({
  activeNumber,
  setActiveNumber,
  currentIndex,
  onNext,
  setCurrentIndex,
}) => {
  // handle previous button
  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setActiveNumber(activeNumber - 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-3">
        <button
          className="bg-yellow-950 cursor-pointer text-white text-sm py-3 px-5 rounded-lg"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="bg-yellow-950 cursor-pointer text-white text-sm py-3 px-5 rounded-lg"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Buttons;
