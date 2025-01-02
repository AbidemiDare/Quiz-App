interface QuizData {
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
}

interface QuestionsProps {
  quiz: QuizData[];
  currentIndex: number;
}

const Questions: React.FC<QuestionsProps> = ({ quiz, currentIndex }) => {
  function decodeHtmlEntity(str: string) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent || doc.body.textContent;
  }

  return (
    <div>
      <h4 className="font-bold text-black text-lg">
        {currentIndex + 1}.){" "}
        {quiz.length > 0 ? decodeHtmlEntity(quiz[currentIndex].question) : " "}
      </h4>
    </div>
  );
};

export default Questions;
