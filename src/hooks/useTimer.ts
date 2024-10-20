import { useState, useEffect } from "react";

export const useTimer = () => {
  const [timer, setTimer] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused]);

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setTimer(30);
    setIsPaused(false);
  };

  return {
    timer,
    isPaused,
    resumeTimer,
    resetTimer,
    pauseTimer,
  };
};
