import React from "react";

interface ResetProps {
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveNumber: React.Dispatch<React.SetStateAction<number>>;
}

const Reset: React.FC<ResetProps> = ({ setCurrentIndex, setActiveNumber }) => {
  function handleReset() {
    setCurrentIndex(0);
    setActiveNumber(0);

    sessionStorage.removeItem("quizState");
  }

  return (
    <div>
      {/* rESET BUTTON */}
      <button
        className="bg-yellow-950 text-xs text-white px-3 py-2 rounded-md"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
};

export default Reset;
