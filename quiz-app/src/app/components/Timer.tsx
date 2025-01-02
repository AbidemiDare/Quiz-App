import React, { useEffect } from "react";

interface TimerProps {
  time: number;
  setTime: (time: number | ((prevTime: number) => number)) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
}

const Timer = ({ time, setTime, isRunning, setIsRunning }: TimerProps) => {
  useEffect(() => {
    const initializeTimer = () => {
      const storedTime = sessionStorage.getItem("quizTimer");
      if (storedTime) {
        const parsedTime = Number(storedTime);
        if (!isNaN(parsedTime)) {
          setTime(parsedTime);
        }
      }
    };

    initializeTimer();

    let timer: NodeJS.Timeout | undefined;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const updatedTime = prevTime - 1;
          sessionStorage.setItem("quizTimer", updatedTime.toString());

          return updatedTime;
        });
      }, 1000);
    }

    if (time === 0) {
      setIsRunning(false);
      clearInterval(timer);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [time]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}s`;
  };

  return (
    <div>
      <span
        className={`text-xl ${time < 300 ? "text-red-500" : "text-green-600"}`}
      >
        {formatTime(time)}
      </span>
    </div>
  );
};

export default Timer;
